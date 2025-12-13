import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatCurrency } from '../lib/utils';
import { Plus, Search } from 'lucide-react';
import { Select } from '../components/ui/select';

export function ProjectsPage() {
  const { projects, brands, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const doneTasks = projectTasks.filter((t) => t.estado === 'done').length;
    return Math.round((doneTasks / projectTasks.length) * 100);
  };

  const getProjectSpent = (projectId: string) => {
    const { projectInfluencers } = useStore.getState();
    return projectInfluencers
      .filter((pi) => pi.projectId === projectId)
      .reduce((sum, pi) => sum + pi.costoAcuerdo, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">Gestiona tus campañas y proyectos</p>
        </div>
        <Button onClick={() => {/* TODO: Create dialog */}}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="planned">Planeados</option>
              <option value="active">Activos</option>
              <option value="on_hold">En Hold</option>
              <option value="done">Completados</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Gastado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const brand = brands.find((b) => b.id === project.brandId);
                const progress = getProjectProgress(project.id);
                const spent = getProjectSpent(project.id);
                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link to={`/projects/${project.id}`} className="hover:underline">
                        {project.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>{brand?.nombre || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.estado === 'active'
                            ? 'default'
                            : project.estado === 'done'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {project.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(project.presupuesto)}</TableCell>
                    <TableCell>{formatCurrency(spent)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver Detalle
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

