import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate, calculateDSO } from '../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, Building2, FolderKanban, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const { invoices, payments, projects, brands } = useStore();

  const kpis = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Facturado YTD
    const facturadoYTD = invoices
      .filter((inv) => {
        const invDate = new Date(inv.fecha);
        return invDate.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    // Facturado este mes
    const facturadoMes = invoices
      .filter((inv) => {
        const invDate = new Date(inv.fecha);
        return invDate.getFullYear() === currentYear && invDate.getMonth() + 1 === currentMonth;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    // Pendientes
    const pendientes = invoices
      .filter((inv) => inv.estado === 'sent' || inv.estado === 'draft')
      .reduce((sum, inv) => sum + inv.total, 0);

    // Vencidas
    const vencidas = invoices
      .filter((inv) => {
        if (!inv.vencimiento) return false;
        const venc = new Date(inv.vencimiento);
        return venc < new Date() && inv.estado !== 'paid';
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    // LTV por marca (suma de facturado por marca)
    const ltvPorMarca = brands.reduce((acc, brand) => {
      const brandInvoices = invoices.filter((inv) => inv.brandId === brand.id);
      const total = brandInvoices.reduce((sum, inv) => sum + inv.total, 0);
      return total;
    }, 0);
    const ltvPromedio = brands.length > 0 ? ltvPorMarca / brands.length : 0;

    // DSO
    const dso = calculateDSO(invoices);

    // Proyectos por estado
    const proyectosActivos = projects.filter((p) => p.estado === 'active').length;
    const proyectosPlaneados = projects.filter((p) => p.estado === 'planned').length;
    const proyectosEnHold = projects.filter((p) => p.estado === 'on_hold').length;
    const proyectosCompletados = projects.filter((p) => p.estado === 'done').length;

    // Margen estimado (presupuesto - costos acuerdos)
    const { projectInfluencers } = useStore.getState();
    const totalPresupuesto = projects.reduce((sum, p) => sum + p.presupuesto, 0);
    const totalCostos = projectInfluencers.reduce((sum, pi) => sum + pi.costoAcuerdo, 0);
    const margenEstimado = totalPresupuesto - totalCostos;
    const margenPorcentaje = totalPresupuesto > 0 ? (margenEstimado / totalPresupuesto) * 100 : 0;

    // Top influencers por ROI (simulado)
    const { influencers } = useStore.getState();
    const influencerROIs = influencers.map((inf) => {
      const proyectosInf = projectInfluencers.filter((pi) => pi.influencerId === inf.id);
      const costoTotal = proyectosInf.reduce((sum, pi) => sum + pi.costoAcuerdo, 0);
      const valorAsignado = proyectosInf.length * inf.tarifaBase * 1.2; // Simulación
      const roi = costoTotal > 0 ? ((valorAsignado - costoTotal) / costoTotal) * 100 : 0;
      return { influencer: inf, roi };
    });
    const topInfluencer = influencerROIs.sort((a, b) => b.roi - a.roi)[0];
    const topROI = topInfluencer?.roi || 0;

    return {
      facturadoYTD,
      facturadoMes,
      pendientes,
      vencidas,
      ltvPromedio,
      dso,
      proyectosActivos,
      proyectosPlaneados,
      proyectosEnHold,
      proyectosCompletados,
      margenEstimado,
      margenPorcentaje,
      topROI,
    };
  }, [invoices, payments, projects, brands]);

  // Datos para gráfico de ingresos (últimos 6 meses)
  const revenueData = useMemo(() => {
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthInvoices = invoices.filter((inv) => {
        const invDate = new Date(inv.fecha);
        return invDate.getFullYear() === date.getFullYear() && invDate.getMonth() === date.getMonth();
      });
      const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        ingresos: total,
      });
    }
    return months;
  }, [invoices]);

  // Datos para gráfico de proyectos por estado
  const projectStatusData = [
    { estado: 'Activos', cantidad: kpis.proyectosActivos },
    { estado: 'Planeados', cantidad: kpis.proyectosPlaneados },
    { estado: 'En Hold', cantidad: kpis.proyectosEnHold },
    { estado: 'Completados', cantidad: kpis.proyectosCompletados },
  ];

  const kpiCards = [
    {
      title: 'Facturado YTD',
      value: formatCurrency(kpis.facturadoYTD),
      icon: DollarSign,
      trend: kpis.facturadoYTD > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Facturado Este Mes',
      value: formatCurrency(kpis.facturadoMes),
      icon: DollarSign,
      trend: 'neutral',
    },
    {
      title: 'Pendientes',
      value: formatCurrency(kpis.pendientes),
      icon: FileText,
      trend: kpis.pendientes > 50000 ? 'down' : 'neutral',
    },
    {
      title: 'Vencidas',
      value: formatCurrency(kpis.vencidas),
      icon: Clock,
      trend: kpis.vencidas > 0 ? 'down' : 'neutral',
    },
    {
      title: 'LTV Promedio',
      value: formatCurrency(kpis.ltvPromedio),
      icon: Building2,
      trend: 'neutral',
    },
    {
      title: 'DSO (Días)',
      value: kpis.dso.toString(),
      icon: Clock,
      trend: kpis.dso < 30 ? 'up' : 'down',
    },
    {
      title: 'Proyectos Activos',
      value: kpis.proyectosActivos.toString(),
      icon: FolderKanban,
      trend: 'neutral',
    },
    {
      title: 'Margen Estimado',
      value: `${formatCurrency(kpis.margenEstimado)} (${kpis.margenPorcentaje.toFixed(1)}%)`,
      icon: TrendingUp,
      trend: kpis.margenPorcentaje > 30 ? 'up' : 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de métricas y KPIs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.trend !== 'neutral' && (
                <div className={`flex items-center text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {kpi.trend === 'up' ? 'Favorable' : 'Atención'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {useStore
                .getState()
                .projects.filter((p) => p.estado === 'active')
                .slice(0, 5)
                .map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">{project.nombre}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(project.presupuesto)}</p>
                    </div>
                    <Badge variant={project.estado === 'active' ? 'default' : 'secondary'}>{project.estado}</Badge>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facturas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices
                .filter((inv) => {
                  if (!inv.vencimiento) return false;
                  const venc = new Date(inv.vencimiento);
                  return venc < new Date() && inv.estado !== 'paid';
                })
                .slice(0, 5)
                .map((invoice) => (
                  <Link
                    key={invoice.id}
                    to="/invoices"
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">{invoice.numero}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(invoice.total)} • {invoice.vencimiento && formatDate(invoice.vencimiento)}
                      </p>
                    </div>
                    <Badge variant="destructive">Vencida</Badge>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

