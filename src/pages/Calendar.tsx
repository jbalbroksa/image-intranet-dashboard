
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/hooks/use-events';
import { CalendarEvent } from '@/types';

export default function Calendar() {
  const { toast } = useToast();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Reunión');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  
  const { 
    events, 
    isLoadingEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useEvents();

  const filteredEvents = events?.filter(event => {
    if (!selectedDay) return false;
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === selectedDay.getDate() &&
      eventDate.getMonth() === selectedDay.getMonth() &&
      eventDate.getFullYear() === selectedDay.getFullYear()
    );
  });

  // Get dates with events for calendar highlighting
  const datesWithEvents = events?.map(event => new Date(event.startDate)) || [];

  const handleAddEvent = () => {
    if (!selectedDay) {
      toast({
        title: "Error",
        description: "Selecciona un día para el evento",
        variant: "destructive"
      });
      return;
    }

    if (!eventTitle) {
      toast({
        title: "Error",
        description: "El título del evento es obligatorio",
        variant: "destructive"
      });
      return;
    }

    // Create start date with time
    const [startHours, startMinutes] = eventStartTime.split(':').map(Number);
    const startDate = new Date(selectedDay);
    startDate.setHours(startHours, startMinutes, 0);

    // Create end date with time
    const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
    const endDate = new Date(selectedDay);
    endDate.setHours(endHours, endMinutes, 0);

    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "La hora de fin debe ser posterior a la hora de inicio",
        variant: "destructive"
      });
      return;
    }

    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      location: eventLocation,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      category: eventCategory
    };

    createEvent(newEvent);
    setIsAddEventOpen(false);
    resetEventForm();
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;

    // Create start date with time
    const [startHours, startMinutes] = eventStartTime.split(':').map(Number);
    const startDate = new Date(selectedDay || new Date());
    startDate.setHours(startHours, startMinutes, 0);

    // Create end date with time
    const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
    const endDate = new Date(selectedDay || new Date());
    endDate.setHours(endHours, endMinutes, 0);

    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "La hora de fin debe ser posterior a la hora de inicio",
        variant: "destructive"
      });
      return;
    }

    const updatedEvent = {
      id: selectedEvent.id,
      title: eventTitle,
      description: eventDescription,
      location: eventLocation,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      category: eventCategory
    };

    updateEvent(updatedEvent);
    setIsEditEventOpen(false);
    resetEventForm();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setEventLocation(event.location || '');
    setEventCategory(event.category);
    
    const startDate = new Date(event.startDate);
    setEventStartTime(
      `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`
    );
    
    const endDate = new Date(event.endDate);
    setEventEndTime(
      `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
    );
    
    setIsEditEventOpen(true);
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setEventCategory('Reunión');
    setEventStartTime('09:00');
    setEventEndTime('10:00');
    setSelectedEvent(null);
  };

  const handleOpenAddEvent = () => {
    resetEventForm();
    setIsAddEventOpen(true);
  };

  // Function to get event badge color based on category
  const getEventCategoryColor = (category: string) => {
    switch (category) {
      case 'Reunión':
        return 'bg-blue-500';
      case 'Entrevista':
        return 'bg-purple-500';
      case 'Cita':
        return 'bg-green-500';
      case 'Recordatorio':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">Organiza tus eventos y citas</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleOpenAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <CalendarComponent
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={es}
                modifiers={{
                  hasEvent: datesWithEvents,
                }}
                modifiersStyles={{
                  hasEvent: { 
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)' 
                  }
                }}
                className="rounded-md"
              />
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span>Reunión</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                <span>Entrevista</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span>Cita</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span>Recordatorio</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Eventos para {selectedDay ? format(selectedDay, "PPPP", { locale: es }) : 'Hoy'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="py-10 text-center">
                  <p>Cargando eventos...</p>
                </div>
              ) : filteredEvents && filteredEvents.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {filteredEvents.map((event) => {
                    const startTime = format(new Date(event.startDate), 'HH:mm');
                    const endTime = format(new Date(event.endDate), 'HH:mm');
                    
                    return (
                      <div 
                        key={event.id} 
                        className="border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-base">{event.title}</h3>
                          <Badge variant="outline">{startTime} - {endTime}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getEventCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          {event.location && (
                            <span className="text-sm text-muted-foreground">
                              {event.location}
                            </span>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center border border-dashed rounded-lg">
                  <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                  <h3 className="font-medium mb-1">No hay eventos para este día</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Añade un nuevo evento para este día.
                  </p>
                  <Button size="sm" onClick={handleOpenAddEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Evento</DialogTitle>
            <DialogDescription>
              Añade un nuevo evento al calendario.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-date" className="text-right text-sm font-medium">
                Fecha
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDay ? format(selectedDay, 'PPP', { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDay}
                      onSelect={setSelectedDay}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-title" className="text-right text-sm font-medium">
                Título
              </label>
              <Input
                id="event-title"
                className="col-span-3"
                placeholder="Título del evento"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-description" className="text-right text-sm font-medium">
                Descripción
              </label>
              <Textarea
                id="event-description"
                className="col-span-3"
                placeholder="Descripción del evento"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-location" className="text-right text-sm font-medium">
                Ubicación
              </label>
              <Input
                id="event-location"
                className="col-span-3"
                placeholder="Ubicación (opcional)"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="event-category" className="text-right text-sm font-medium">
                Categoría
              </label>
              <select
                id="event-category"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
              >
                <option value="Reunión">Reunión</option>
                <option value="Entrevista">Entrevista</option>
                <option value="Cita">Cita</option>
                <option value="Recordatorio">Recordatorio</option>
              </select>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="event-start-time" className="text-sm font-medium">
                  Hora de inicio
                </label>
                <Input
                  id="event-start-time"
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="event-end-time" className="text-sm font-medium">
                  Hora de fin
                </label>
                <Input
                  id="event-end-time"
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent}>
              Guardar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Modifica los detalles del evento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-event-date" className="text-right text-sm font-medium">
                Fecha
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDay ? format(selectedDay, 'PPP', { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDay}
                      onSelect={setSelectedDay}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-event-title" className="text-right text-sm font-medium">
                Título
              </label>
              <Input
                id="edit-event-title"
                className="col-span-3"
                placeholder="Título del evento"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-event-description" className="text-right text-sm font-medium">
                Descripción
              </label>
              <Textarea
                id="edit-event-description"
                className="col-span-3"
                placeholder="Descripción del evento"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-event-location" className="text-right text-sm font-medium">
                Ubicación
              </label>
              <Input
                id="edit-event-location"
                className="col-span-3"
                placeholder="Ubicación (opcional)"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-event-category" className="text-right text-sm font-medium">
                Categoría
              </label>
              <select
                id="edit-event-category"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
              >
                <option value="Reunión">Reunión</option>
                <option value="Entrevista">Entrevista</option>
                <option value="Cita">Cita</option>
                <option value="Recordatorio">Recordatorio</option>
              </select>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-event-start-time" className="text-sm font-medium">
                  Hora de inicio
                </label>
                <Input
                  id="edit-event-start-time"
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-event-end-time" className="text-sm font-medium">
                  Hora de fin
                </label>
                <Input
                  id="edit-event-end-time"
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente este evento del calendario.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditEvent}>
                Guardar Cambios
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
