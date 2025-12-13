import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, User, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { formatDate } from '../lib/utils';

export function PeoplePage() {
  const { people, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const filteredPeople = people.filter((person) =>
    person.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.rol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPersonTasks = (personId: string) => {
    return tasks.filter((t) => t.asignadoA === personId);
  };

  const getPersonTasksByStatus = (personId: string) => {
    const personTasks = getPersonTasks(personId);
    return {
      total: personTasks.length,
      backlog: personTasks.filter((t) => t.estado === 'backlog').length,
      in_progress: personTasks.filter((t) => t.estado === 'in_progress').length,
      review: personTasks.filter((t) => t.estado === 'review').length,
      done: personTasks.filter((t) => t.estado === 'done').length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipo</h1>
          <p className="text-muted-foreground">Gestiona el equipo de trabajo</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Persona
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o rol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* People Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPeople.map((person) => {
          const taskStats = getPersonTasksByStatus(person.id);
          return (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{person.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">{person.rol}</p>
                    </div>
                  </div>
                  <Badge variant={person.activo ? 'default' : 'secondary'}>
                    {person.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{person.email}</span>
                  </div>
                  {person.telefono && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{person.telefono}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Tareas Asignadas</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <span className="ml-1 font-semibold">{taskStats.total}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">En Progreso:</span>
                      <span className="ml-1 font-semibold text-blue-600">{taskStats.in_progress}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revisión:</span>
                      <span className="ml-1 font-semibold text-yellow-600">{taskStats.review}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completadas:</span>
                      <span className="ml-1 font-semibold text-green-600">{taskStats.done}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedPersonId(person.id)}
                >
                  Ver Tareas
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Persona</DialogTitle>
            <DialogDescription>Agrega un nuevo miembro al equipo</DialogDescription>
          </DialogHeader>
          <CreatePersonForm onClose={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Person Tasks Dialog */}
      {selectedPersonId && (
        <PersonTasksDialog
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
}

function CreatePersonForm({ onClose }: { onClose: () => void }) {
  const { addPerson } = useStore();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    telefono: '',
    activo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPerson({
      ...formData,
      telefono: formData.telefono || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <Input
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Rol</label>
        <Input
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Teléfono (opcional)</label>
        <Input
          type="tel"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Crear</Button>
      </div>
    </form>
  );
}

function PersonTasksDialog({ personId, onClose }: { personId: string; onClose: () => void }) {
  const { people, tasks, projects } = useStore();
  const person = people.find((p) => p.id === personId);
  const personTasks = tasks.filter((t) => t.asignadoA === personId);

  if (!person) return null;

  return (
    <Dialog open={!!personId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tareas de {person.nombre}</DialogTitle>
          <DialogDescription>{person.rol} • {personTasks.length} tareas asignadas</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {personTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay tareas asignadas</p>
          ) : (
            personTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <Card key={task.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.titulo}</h4>
                        {task.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{task.descripcion}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Proyecto: {project?.nombre || 'N/A'}</span>
                          {task.dueDate && (
                            <span>Vence: {formatDate(task.dueDate)}</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.estado === 'done'
                            ? 'default'
                            : task.estado === 'in_progress'
                            ? 'secondary'
                            : task.estado === 'review'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {task.estado === 'done'
                          ? 'Completada'
                          : task.estado === 'in_progress'
                          ? 'En Progreso'
                          : task.estado === 'review'
                          ? 'Revisión'
                          : 'Backlog'}
                      </Badge>
                    </div>
                    {project && (
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm" className="mt-2">
                          Ver Proyecto
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

