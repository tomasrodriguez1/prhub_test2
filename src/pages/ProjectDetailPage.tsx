import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, brands, tasks, projectInfluencers, influencers, people, addTask } = useStore();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const project = projects.find((p) => p.id === id);
  if (!project) {
    return (
      <div>
        <p>Proyecto no encontrado</p>
        <Link to="/projects">
          <Button>Volver a Proyectos</Button>
        </Link>
      </div>
    );
  }

  const brand = brands.find((b) => b.id === project.brandId);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectInfs = projectInfluencers
    .filter((pi) => pi.projectId === project.id)
    .map((pi) => ({
      ...pi,
      influencer: influencers.find((inf) => inf.id === pi.influencerId),
    }))
    .filter((pi) => pi.influencer);

  const totalSpent = projectInfs.reduce((sum, pi) => sum + pi.costoAcuerdo, 0);
  const remaining = project.presupuesto - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.nombre}</h1>
          <p className="text-muted-foreground">
            {brand?.nombre} • {formatDate(project.fechaInicio)} - {project.fechaFin ? formatDate(project.fechaFin) : 'En curso'}
          </p>
        </div>
        <Badge variant={project.estado === 'active' ? 'default' : 'secondary'}>
          {project.estado}
        </Badge>
      </div>

      {/* Project Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(project.presupuesto)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gastado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">Restante: {formatCurrency(remaining)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {projectTasks.filter((t) => t.estado === 'done').length} completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tareas</CardTitle>
          <Button onClick={() => setTaskDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </CardHeader>
        <CardContent>
          <KanbanBoard tasks={projectTasks} projectId={project.id} />
        </CardContent>
      </Card>

      {/* Influencers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Influencers Asignados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Costo Acuerdo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectInfs.map((pi) => (
                <TableRow key={`${pi.projectId}-${pi.influencerId}`}>
                  <TableCell className="font-medium">{pi.influencer!.nombre}</TableCell>
                  <TableCell>{pi.rol}</TableCell>
                  <TableCell>{formatCurrency(pi.costoAcuerdo)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/influencers/${pi.influencerId}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalle
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
          </DialogHeader>
          <CreateTaskForm projectId={project.id} onClose={() => setTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateTaskForm({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const { addTask, people } = useStore();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'backlog' as const,
    dueDate: '',
    asignadoA: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      projectId,
      ...formData,
      asignadoA: formData.asignadoA || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Título</label>
        <Input
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <Input
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Estado</label>
        <Select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
        >
          <option value="backlog">Backlog</option>
          <option value="in_progress">En Progreso</option>
          <option value="review">Revisión</option>
          <option value="done">Completada</option>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Fecha Límite</label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Asignar a</label>
        <Select
          value={formData.asignadoA}
          onChange={(e) => setFormData({ ...formData, asignadoA: e.target.value })}
        >
          <option value="">Sin asignar</option>
          {people.filter((p) => p.activo).map((person) => (
            <option key={person.id} value={person.id}>
              {person.nombre} - {person.rol}
            </option>
          ))}
        </Select>
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

