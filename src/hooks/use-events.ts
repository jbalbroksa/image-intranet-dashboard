
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get all events for the current user
  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to CalendarEvent interface
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: event.start_date,
        endDate: event.end_date,
        category: event.category
      })) as CalendarEvent[];
    },
    enabled: !!user?.id
  });

  // Create an event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<CalendarEvent, 'id'>) => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      // Map CalendarEvent interface to database fields
      const dbData = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        category: eventData.category,
        user_id: user.id
      };
      
      const { error } = await supabase
        .from('calendar_events')
        .insert(dbData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Evento creado',
        description: 'El evento ha sido creado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear evento',
        description: error.message || 'Ocurrió un error al crear el evento',
        variant: 'destructive'
      });
    }
  });

  // Update an event
  const updateEventMutation = useMutation({
    mutationFn: async (eventData: Partial<CalendarEvent> & { id: string }) => {
      const { id, ...rest } = eventData;
      
      // Map CalendarEvent interface to database fields
      const dbData: Record<string, any> = {};
      
      if (rest.title) dbData.title = rest.title;
      if (rest.description !== undefined) dbData.description = rest.description;
      if (rest.location !== undefined) dbData.location = rest.location;
      if (rest.startDate) dbData.start_date = rest.startDate;
      if (rest.endDate) dbData.end_date = rest.endDate;
      if (rest.category) dbData.category = rest.category;
      
      const { error } = await supabase
        .from('calendar_events')
        .update(dbData)
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Evento actualizado',
        description: 'El evento ha sido actualizado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar evento',
        description: error.message || 'Ocurrió un error al actualizar el evento',
        variant: 'destructive'
      });
    }
  });

  // Delete an event
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Evento eliminado',
        description: 'El evento ha sido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar evento',
        description: error.message || 'Ocurrió un error al eliminar el evento',
        variant: 'destructive'
      });
    }
  });

  return {
    events,
    isLoadingEvents,
    eventsError,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isLoading: isLoadingEvents || isLoading || 
               createEventMutation.isPending || 
               updateEventMutation.isPending || 
               deleteEventMutation.isPending
  };
}
