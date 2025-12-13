import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, Building2, FileText, FolderKanban, Users, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { brands, invoices, projects, brandHistories, projectInfluencers, influencers } = useStore();

  const brand = brands.find((b) => b.id === id);
  if (!brand) {
    return (
      <div>
        <p>Marca no encontrada</p>
        <Link to="/brands">
          <Button>Volver a Marcas</Button>
        </Link>
      </div>
    );
  }

  const brandInvoices = invoices.filter((inv) => inv.brandId === brand.id);
  const brandProjects = projects.filter((p) => p.brandId === brand.id);
  const brandHistory = brandHistories
    .filter((bh) => bh.brandId === brand.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // KPIs de marca
  const totalFacturado = brandInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPagado = brandInvoices
    .filter((inv) => inv.estado === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendiente = brandInvoices
    .filter((inv) => inv.estado !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const numProyectos = brandProjects.length;
  const proyectosActivos = brandProjects.filter((p) => p.estado === 'active').length;

  // Influencers recurrentes
  const brandInfluencerIds = new Set(
    brandProjects.flatMap((p) => projectInfluencers.filter((pi) => pi.projectId === p.id).map((pi) => pi.influencerId))
  );
  const brandInfluencers = Array.from(brandInfluencerIds)
    .map((infId) => influencers.find((inf) => inf.id === infId))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{brand.nombre}</h1>
          <p className="text-muted-foreground">{brand.sector} • {brand.pais}</p>
        </div>
        <div className="ml-auto">
          <Badge
            variant={
              brand.estado === 'active' ? 'default' : brand.estado === 'inactive' ? 'secondary' : 'outline'
            }
          >
            {brand.estado === 'active' ? 'Activa' : brand.estado === 'inactive' ? 'Inactiva' : 'Prospecto'}
          </Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFacturado)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendiente)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numProyectos}</div>
            <p className="text-xs text-muted-foreground">{proyectosActivos} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandInfluencers.length}</div>
            <p className="text-xs text-muted-foreground">recurrentes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brandHistory.map((history) => (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{history.resumen}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(history.fecha)}</span>
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {history.tipo}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brandProjects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{project.nombre}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(project.presupuesto)}</p>
                  </div>
                  <Badge variant={project.estado === 'active' ? 'default' : 'secondary'}>
                    {project.estado}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Influencers Recurrentes */}
      <Card>
        <CardHeader>
          <CardTitle>Influencers Recurrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Plataformas</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Tarifa Base</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandInfluencers.map((inf) => (
                <TableRow key={inf!.id}>
                  <TableCell className="font-medium">{inf!.nombre}</TableCell>
                  <TableCell>{inf!.plataformas.join(', ')}</TableCell>
                  <TableCell>{inf!.alcance.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(inf!.tarifaBase)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/influencers/${inf!.id}`}>
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
    </div>
  );
}

