import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, TrendingUp, Eye, Heart, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function InfluencerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { influencers, influencerHistories, projectInfluencers, projects, brands } = useStore();

  const influencer = influencers.find((inf) => inf.id === id);
  if (!influencer) {
    return (
      <div>
        <p>Influencer no encontrado</p>
        <Link to="/influencers">
          <Button>Volver a Influencers</Button>
        </Link>
      </div>
    );
  }

  const histories = influencerHistories
    .filter((ih) => ih.influencerId === influencer.id)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const influencerProjects = projectInfluencers
    .filter((pi) => pi.influencerId === influencer.id)
    .map((pi) => ({
      ...pi,
      project: projects.find((p) => p.id === pi.projectId),
      brand: brands.find((b) => b.id === projects.find((p) => p.id === pi.projectId)?.brandId),
    }))
    .filter((pi) => pi.project);

  // KPIs agregados
  const totalImpressions = histories
    .filter((h) => h.metrica === 'impressions')
    .reduce((sum, h) => sum + h.valor, 0);
  const avgEngagement = histories
    .filter((h) => h.metrica === 'engagement')
    .reduce((sum, h, _, arr) => sum + h.valor / arr.length, 0);
  const totalCost = influencerProjects.reduce((sum, pi) => sum + pi.costoAcuerdo, 0);
  const estimatedROI = totalCost > 0 ? ((totalImpressions * 0.01 - totalCost) / totalCost) * 100 : 0;

  // Datos para gráfico de métricas
  const metricsData = histories
    .filter((h) => h.metrica === 'impressions' || h.metrica === 'engagement')
    .map((h) => ({
      fecha: formatDate(h.fecha),
      [h.metrica === 'impressions' ? 'Impresiones' : 'Engagement']: h.valor,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/influencers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{influencer.nombre}</h1>
          <p className="text-muted-foreground">
            {influencer.plataformas.join(', ')} • {influencer.alcance.toLocaleString()} alcance
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impresiones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Promedio</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Estimado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estimatedROI.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Historial */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Proyecto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.slice(-10).map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{formatDate(history.fecha)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{history.metrica}</Badge>
                    </TableCell>
                    <TableCell>
                      {history.metrica === 'impressions' || history.metrica === 'clicks'
                        ? history.valor.toLocaleString()
                        : `${history.valor}%`}
                    </TableCell>
                    <TableCell>
                      {history.projectId ? (
                        <Link to={`/projects/${history.projectId}`} className="hover:underline">
                          Ver proyecto
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {influencerProjects.map((pi) => (
                <div
                  key={`${pi.projectId}-${pi.influencerId}`}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{pi.project?.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {pi.brand?.nombre} • {formatCurrency(pi.costoAcuerdo)}
                    </p>
                  </div>
                  <Link to={`/projects/${pi.projectId}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de métricas */}
      {metricsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Impresiones" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="Engagement" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

