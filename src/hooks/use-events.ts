
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todos los eventos del usuario actual
  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as CalendarEvent[];
    },
    enabled: !!session?.user?.id
  });

  // Crear un evento
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<CalendarEvent, 'id' | 'userId'>) => {
      if (!session?.user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          user_id: session.user.id
        });
      
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

  // Actualizar un evento
  const updateEventMutation = useMutation({
    mutationFn: async (eventData: Partial<CalendarEvent> & { id: string }) => {
      const { id, ...rest } = eventData;
      const { error } = await supabase
        .from('calendar_events')
        .update(rest)
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

  // Eliminar un evento
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
