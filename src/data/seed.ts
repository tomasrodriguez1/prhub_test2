import type {
  Brand,
  Influencer,
  Project,
  Task,
  Invoice,
  Payment,
  BrandHistory,
  InfluencerHistory,
  ProjectInfluencer,
  BrandContact,
  Person,
} from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const brands: Brand[] = [
  {
    id: 'brand-1',
    nombre: 'TechFlow Solutions',
    sector: 'Tecnología',
    pais: 'España',
    estado: 'active',
    notas: 'Cliente premium, muy satisfecho con resultados',
    createdAt: '2025-08-15',
    updatedAt: '2025-12-10',
  },
  {
    id: 'brand-2',
    nombre: 'EcoWear Fashion',
    sector: 'Moda',
    pais: 'España',
    estado: 'active',
    notas: 'Enfoque en sostenibilidad',
    createdAt: '2025-09-20',
    updatedAt: '2025-12-08',
  },
  {
    id: 'brand-3',
    nombre: 'FitLife Nutrition',
    sector: 'Salud y Bienestar',
    pais: 'México',
    estado: 'active',
    notas: 'Campañas estacionales',
    createdAt: '2025-09-10',
    updatedAt: '2025-12-05',
  },
  {
    id: 'brand-4',
    nombre: 'HomeDecor Plus',
    sector: 'Hogar',
    pais: 'España',
    estado: 'active',
    createdAt: '2025-10-12',
    updatedAt: '2025-12-12',
  },
  {
    id: 'brand-5',
    nombre: 'Gourmet Delights',
    sector: 'Alimentación',
    pais: 'España',
    estado: 'inactive',
    notas: 'Pausado temporalmente',
    createdAt: '2025-08-28',
    updatedAt: '2025-11-30',
  },
  {
    id: 'brand-6',
    nombre: 'TravelHub',
    sector: 'Turismo',
    pais: 'España',
    estado: 'prospect',
    notas: 'En negociación',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-15',
  },
];

const brandContacts: BrandContact[] = [
  { id: 'contact-1', brandId: 'brand-1', nombre: 'María García', email: 'maria@techflow.com', rol: 'CMO', telefono: '+34 600 123 456' },
  { id: 'contact-2', brandId: 'brand-2', nombre: 'Carlos Ruiz', email: 'carlos@ecowear.com', rol: 'Marketing Director' },
  { id: 'contact-3', brandId: 'brand-3', nombre: 'Ana Martínez', email: 'ana@fitlife.com', rol: 'Brand Manager' },
  { id: 'contact-4', brandId: 'brand-4', nombre: 'Luis Fernández', email: 'luis@homedecor.com', rol: 'CEO' },
];

const people: Person[] = [
  { id: 'person-1', nombre: 'Laura Sánchez', email: 'laura@prhub.com', rol: 'Project Manager', telefono: '+34 600 111 222', activo: true, createdAt: '2025-08-01' },
  { id: 'person-2', nombre: 'Miguel Torres', email: 'miguel@prhub.com', rol: 'Content Creator', telefono: '+34 600 222 333', activo: true, createdAt: '2025-08-01' },
  { id: 'person-3', nombre: 'Carmen López', email: 'carmen@prhub.com', rol: 'Account Manager', telefono: '+34 600 333 444', activo: true, createdAt: '2025-08-01' },
  { id: 'person-4', nombre: 'David Martín', email: 'david@prhub.com', rol: 'Designer', telefono: '+34 600 444 555', activo: true, createdAt: '2025-08-01' },
  { id: 'person-5', nombre: 'Elena Rodríguez', email: 'elena@prhub.com', rol: 'Analyst', telefono: '+34 600 555 666', activo: true, createdAt: '2025-08-01' },
];

const influencers: Influencer[] = [
  { id: 'inf-1', nombre: 'Sofia Lifestyle', plataformas: ['Instagram', 'TikTok'], alcance: 250000, tarifaBase: 5000, etiquetas: ['lifestyle', 'fashion'], createdAt: '2025-08-01' },
  { id: 'inf-2', nombre: 'TechReview Pro', plataformas: ['YouTube', 'Instagram'], alcance: 180000, tarifaBase: 8000, etiquetas: ['tech', 'reviews'], createdAt: '2025-08-01' },
  { id: 'inf-3', nombre: 'Fitness Coach Alex', plataformas: ['Instagram', 'TikTok', 'YouTube'], alcance: 320000, tarifaBase: 6000, etiquetas: ['fitness', 'health'], createdAt: '2025-08-01' },
  { id: 'inf-4', nombre: 'Foodie Adventures', plataformas: ['Instagram', 'TikTok'], alcance: 150000, tarifaBase: 3500, etiquetas: ['food', 'travel'], createdAt: '2025-08-01' },
  { id: 'inf-5', nombre: 'Home Design Expert', plataformas: ['Instagram', 'Pinterest'], alcance: 200000, tarifaBase: 4500, etiquetas: ['home', 'design'], createdAt: '2025-08-01' },
  { id: 'inf-6', nombre: 'Travel Diaries', plataformas: ['Instagram', 'YouTube'], alcance: 280000, tarifaBase: 5500, etiquetas: ['travel', 'lifestyle'], createdAt: '2025-08-01' },
  { id: 'inf-7', nombre: 'Beauty Secrets', plataformas: ['Instagram', 'TikTok'], alcance: 190000, tarifaBase: 4000, etiquetas: ['beauty', 'skincare'], createdAt: '2025-08-01' },
  { id: 'inf-8', nombre: 'Gaming World', plataformas: ['Twitch', 'YouTube'], alcance: 450000, tarifaBase: 12000, etiquetas: ['gaming', 'tech'], createdAt: '2025-08-01' },
  { id: 'inf-9', nombre: 'Sustainable Living', plataformas: ['Instagram', 'TikTok'], alcance: 120000, tarifaBase: 3000, etiquetas: ['sustainability', 'eco'], createdAt: '2025-08-01' },
  { id: 'inf-10', nombre: 'Pet Lovers', plataformas: ['Instagram', 'TikTok'], alcance: 160000, tarifaBase: 3800, etiquetas: ['pets', 'animals'], createdAt: '2025-08-01' },
  { id: 'inf-11', nombre: 'Fashion Forward', plataformas: ['Instagram', 'TikTok'], alcance: 220000, tarifaBase: 5000, etiquetas: ['fashion', 'style'], createdAt: '2025-08-01' },
  { id: 'inf-12', nombre: 'Business Insights', plataformas: ['LinkedIn', 'YouTube'], alcance: 100000, tarifaBase: 7000, etiquetas: ['business', 'entrepreneurship'], createdAt: '2025-08-01' },
  { id: 'inf-13', nombre: 'Music Vibes', plataformas: ['Instagram', 'TikTok', 'YouTube'], alcance: 350000, tarifaBase: 9000, etiquetas: ['music', 'entertainment'], createdAt: '2025-08-01' },
  { id: 'inf-14', nombre: 'Art & Creativity', plataformas: ['Instagram', 'Pinterest'], alcance: 140000, tarifaBase: 3200, etiquetas: ['art', 'design'], createdAt: '2025-08-01' },
  { id: 'inf-15', nombre: 'Wellness Journey', plataformas: ['Instagram', 'YouTube'], alcance: 175000, tarifaBase: 4200, etiquetas: ['wellness', 'mindfulness'], createdAt: '2025-08-01' },
];

const projects: Project[] = [
  { id: 'proj-1', brandId: 'brand-1', nombre: 'Lanzamiento Producto X', presupuesto: 50000, estado: 'active', fechaInicio: '2025-09-01', fechaFin: '2025-11-30', descripcion: 'Campaña de lanzamiento del nuevo producto' },
  { id: 'proj-2', brandId: 'brand-2', nombre: 'Campaña Otoño 2025', presupuesto: 35000, estado: 'active', fechaInicio: '2025-10-01', fechaFin: '2025-12-31' },
  { id: 'proj-3', brandId: 'brand-3', nombre: 'Wellness Challenge', presupuesto: 28000, estado: 'on_hold', fechaInicio: '2025-09-15', descripcion: 'Pausado por cambios en estrategia' },
  { id: 'proj-4', brandId: 'brand-1', nombre: 'Brand Awareness Q4', presupuesto: 45000, estado: 'done', fechaInicio: '2025-10-01', fechaFin: '2025-12-31' },
  { id: 'proj-5', brandId: 'brand-4', nombre: 'Home Makeover Series', presupuesto: 32000, estado: 'active', fechaInicio: '2025-10-10', fechaFin: '2026-02-28' },
  { id: 'proj-6', brandId: 'brand-2', nombre: 'Sustainable Fashion Week', presupuesto: 40000, estado: 'planned', fechaInicio: '2026-02-01', fechaFin: '2026-02-28', descripcion: 'Campaña planeada para febrero 2026' },
  { id: 'proj-7', brandId: 'brand-3', nombre: 'New Year Reset', presupuesto: 25000, estado: 'done', fechaInicio: '2025-12-15', fechaFin: '2026-01-31' },
  { id: 'proj-8', brandId: 'brand-4', nombre: 'Interior Design Tips', presupuesto: 22000, estado: 'active', fechaInicio: '2025-11-05', fechaFin: '2026-01-31' },
];

const projectInfluencers: ProjectInfluencer[] = [
  { projectId: 'proj-1', influencerId: 'inf-2', rol: 'Review Principal', costoAcuerdo: 8000, KPIsObjetivo: { impressions: 500000, engagement: 5 } },
  { projectId: 'proj-1', influencerId: 'inf-8', rol: 'Unboxing Video', costoAcuerdo: 12000, KPIsObjetivo: { views: 200000, engagement: 4 } },
  { projectId: 'proj-2', influencerId: 'inf-1', rol: 'Fashion Showcase', costoAcuerdo: 5000, KPIsObjetivo: { impressions: 300000, engagement: 6 } },
  { projectId: 'proj-2', influencerId: 'inf-11', rol: 'Style Guide', costoAcuerdo: 5000 },
  { projectId: 'proj-3', influencerId: 'inf-3', rol: 'Challenge Leader', costoAcuerdo: 6000 },
  { projectId: 'proj-4', influencerId: 'inf-2', rol: 'Tech Reviews', costoAcuerdo: 8000 },
  { projectId: 'proj-5', influencerId: 'inf-5', rol: 'Home Tours', costoAcuerdo: 4500 },
  { projectId: 'proj-5', influencerId: 'inf-14', rol: 'Design Tips', costoAcuerdo: 3200 },
  { projectId: 'proj-6', influencerId: 'inf-9', rol: 'Sustainability Focus', costoAcuerdo: 3000 },
  { projectId: 'proj-7', influencerId: 'inf-3', rol: 'Fitness Content', costoAcuerdo: 6000 },
  { projectId: 'proj-8', influencerId: 'inf-5', rol: 'Interior Design', costoAcuerdo: 4500 },
];

const tasks: Task[] = [
  { id: 'task-1', projectId: 'proj-1', titulo: 'Briefing inicial con TechReview Pro', estado: 'done', dueDate: '2025-09-05', asignadoA: 'person-1' },
  { id: 'task-2', projectId: 'proj-1', titulo: 'Revisión de guión del video', estado: 'in_progress', dueDate: '2025-11-20', asignadoA: 'person-2' },
  { id: 'task-3', projectId: 'proj-1', titulo: 'Aprobación de contenido', estado: 'review', dueDate: '2025-11-25', asignadoA: 'person-3' },
  { id: 'task-4', projectId: 'proj-1', titulo: 'Publicación en YouTube', estado: 'backlog', dueDate: '2025-12-01', asignadoA: 'person-2' },
  { id: 'task-5', projectId: 'proj-2', titulo: 'Coordinación con Sofia Lifestyle', estado: 'done', dueDate: '2025-10-05', asignadoA: 'person-3' },
  { id: 'task-6', projectId: 'proj-2', titulo: 'Sesión de fotos otoño', estado: 'in_progress', dueDate: '2025-12-15', asignadoA: 'person-4' },
  { id: 'task-7', projectId: 'proj-2', titulo: 'Edición de contenido', estado: 'backlog', dueDate: '2025-12-20', asignadoA: 'person-2' },
  { id: 'task-8', projectId: 'proj-3', titulo: 'Pausar campaña - esperando aprobación', estado: 'done', dueDate: '2025-09-20', asignadoA: 'person-1' },
  { id: 'task-9', projectId: 'proj-4', titulo: 'Reporte final de campaña', estado: 'done', dueDate: '2025-12-30', asignadoA: 'person-5' },
  { id: 'task-10', projectId: 'proj-5', titulo: 'Planificación de contenido mensual', estado: 'in_progress', dueDate: '2025-12-25', asignadoA: 'person-1' },
  { id: 'task-11', projectId: 'proj-5', titulo: 'Primera sesión de fotos', estado: 'review', dueDate: '2025-12-28', asignadoA: 'person-4' },
  { id: 'task-12', projectId: 'proj-5', titulo: 'Publicación serie 1', estado: 'backlog', dueDate: '2026-01-05', asignadoA: 'person-2' },
  { id: 'task-13', projectId: 'proj-6', titulo: 'Briefing con influencers', estado: 'backlog', dueDate: '2026-01-20', descripcion: 'Preparación para campaña de febrero', asignadoA: 'person-3' },
  { id: 'task-14', projectId: 'proj-7', titulo: 'Cierre de campaña', estado: 'done', dueDate: '2026-01-31', asignadoA: 'person-1' },
  { id: 'task-15', projectId: 'proj-8', titulo: 'Creación de guiones', estado: 'in_progress', dueDate: '2025-12-22', asignadoA: 'person-2' },
  { id: 'task-16', projectId: 'proj-8', titulo: 'Grabación videos', estado: 'backlog', dueDate: '2026-01-30', asignadoA: 'person-2' },
  { id: 'task-17', projectId: 'proj-1', titulo: 'Análisis de métricas', estado: 'backlog', dueDate: '2025-12-10', asignadoA: 'person-5' },
  { id: 'task-18', projectId: 'proj-2', titulo: 'Optimización de hashtags', estado: 'backlog', dueDate: '2025-12-18', asignadoA: 'person-5' },
  { id: 'task-19', projectId: 'proj-5', titulo: 'Colaboración con marca', estado: 'review', dueDate: '2025-12-26', asignadoA: 'person-3' },
  { id: 'task-20', projectId: 'proj-8', titulo: 'Publicación contenido', estado: 'backlog', dueDate: '2026-01-15', asignadoA: 'person-2' },
];

const invoices: Invoice[] = [
  { id: 'inv-1', brandId: 'brand-1', projectId: 'proj-1', numero: 'INV-2025-001', fecha: '2025-09-05', total: 20000, estado: 'sent', vencimiento: '2025-10-05', concepto: 'Anticipo campaña Producto X' },
  { id: 'inv-2', brandId: 'brand-2', projectId: 'proj-2', numero: 'INV-2025-002', fecha: '2025-10-01', total: 10000, estado: 'paid', vencimiento: '2025-11-01', concepto: 'Anticipo Otoño 2025' },
  { id: 'inv-3', brandId: 'brand-1', projectId: 'proj-4', numero: 'INV-2025-045', fecha: '2025-12-01', total: 45000, estado: 'paid', vencimiento: '2026-01-01', concepto: 'Campaña Q4 Brand Awareness' },
  { id: 'inv-4', brandId: 'brand-3', projectId: 'proj-3', numero: 'INV-2025-003', fecha: '2025-09-15', total: 6000, estado: 'draft', concepto: 'Parcial Wellness Challenge' },
  { id: 'inv-5', brandId: 'brand-4', projectId: 'proj-5', numero: 'INV-2025-004', fecha: '2025-10-10', total: 7700, estado: 'sent', vencimiento: '2025-11-10', concepto: 'Inicio Home Makeover' },
  { id: 'inv-6', brandId: 'brand-2', projectId: 'proj-6', numero: 'INV-2026-005', fecha: '2026-01-15', total: 3000, estado: 'draft', concepto: 'Anticipo Sustainable Fashion' },
  { id: 'inv-7', brandId: 'brand-3', projectId: 'proj-7', numero: 'INV-2025-050', fecha: '2025-12-20', total: 25000, estado: 'paid', vencimiento: '2026-01-20', concepto: 'Campaña New Year Reset' },
  { id: 'inv-8', brandId: 'brand-4', projectId: 'proj-8', numero: 'INV-2025-006', fecha: '2025-11-05', total: 4500, estado: 'sent', vencimiento: '2025-12-05', concepto: 'Inicio Interior Design' },
  { id: 'inv-9', brandId: 'brand-1', numero: 'INV-2025-007', fecha: '2025-11-20', total: 15000, estado: 'overdue', vencimiento: '2025-11-15', concepto: 'Servicios adicionales' },
  { id: 'inv-10', brandId: 'brand-2', numero: 'INV-2025-008', fecha: '2025-12-10', total: 5000, estado: 'sent', vencimiento: '2026-01-10', concepto: 'Servicios de consultoría' },
  { id: 'inv-11', brandId: 'brand-1', projectId: 'proj-1', numero: 'INV-2025-009', fecha: '2025-12-01', total: 30000, estado: 'sent', vencimiento: '2026-01-01', concepto: 'Saldo campaña Producto X' },
  { id: 'inv-12', brandId: 'brand-4', projectId: 'proj-5', numero: 'INV-2026-010', fecha: '2026-01-05', total: 12300, estado: 'draft', concepto: 'Continuación Home Makeover' },
  { id: 'inv-13', brandId: 'brand-3', numero: 'INV-2025-011', fecha: '2025-11-25', total: 8000, estado: 'overdue', vencimiento: '2025-11-20', concepto: 'Servicios varios' },
  { id: 'inv-14', brandId: 'brand-1', numero: 'INV-2025-012', fecha: '2025-12-12', total: 12000, estado: 'sent', vencimiento: '2026-01-12', concepto: 'Mantenimiento cuenta' },
];

const payments: Payment[] = [
  { id: 'pay-1', invoiceId: 'inv-2', fecha: '2025-10-15', monto: 10000, metodo: 'bank_transfer', notas: 'Pago completo' },
  { id: 'pay-2', invoiceId: 'inv-3', fecha: '2025-12-05', monto: 45000, metodo: 'bank_transfer' },
  { id: 'pay-3', invoiceId: 'inv-7', fecha: '2026-01-18', monto: 25000, metodo: 'bank_transfer' },
  { id: 'pay-4', invoiceId: 'inv-2', fecha: '2025-10-20', monto: 5000, metodo: 'credit_card', notas: 'Pago parcial adicional' },
];

const brandHistories: BrandHistory[] = [
  { id: 'bh-1', brandId: 'brand-1', fecha: '2025-08-15', tipo: 'milestone', resumen: 'Cliente adquirido', metadata: { source: 'referral' } },
  { id: 'bh-2', brandId: 'brand-1', fecha: '2025-10-01', tipo: 'project', resumen: 'Inicio campaña Brand Awareness Q4', metadata: { projectId: 'proj-4' } },
  { id: 'bh-3', brandId: 'brand-1', fecha: '2025-12-01', tipo: 'invoice', resumen: 'Factura INV-2025-045 emitida (€45,000)', metadata: { invoiceId: 'inv-3', amount: 45000 } },
  { id: 'bh-4', brandId: 'brand-1', fecha: '2025-12-05', tipo: 'payment', resumen: 'Pago recibido €45,000', metadata: { paymentId: 'pay-2', amount: 45000 } },
  { id: 'bh-5', brandId: 'brand-1', fecha: '2025-09-05', tipo: 'invoice', resumen: 'Factura INV-2025-001 emitida (€20,000)', metadata: { invoiceId: 'inv-1' } },
  { id: 'bh-6', brandId: 'brand-2', fecha: '2025-09-20', tipo: 'milestone', resumen: 'Cliente adquirido', metadata: {} },
  { id: 'bh-7', brandId: 'brand-2', fecha: '2025-10-01', tipo: 'invoice', resumen: 'Factura INV-2025-002 emitida (€10,000)', metadata: { invoiceId: 'inv-2' } },
  { id: 'bh-8', brandId: 'brand-2', fecha: '2025-10-15', tipo: 'payment', resumen: 'Pago recibido €10,000', metadata: { paymentId: 'pay-1', amount: 10000 } },
  { id: 'bh-9', brandId: 'brand-3', fecha: '2025-09-10', tipo: 'milestone', resumen: 'Cliente adquirido', metadata: {} },
  { id: 'bh-10', brandId: 'brand-3', fecha: '2025-12-20', tipo: 'invoice', resumen: 'Factura INV-2025-050 emitida (€25,000)', metadata: { invoiceId: 'inv-7' } },
  { id: 'bh-11', brandId: 'brand-3', fecha: '2026-01-18', tipo: 'payment', resumen: 'Pago recibido €25,000', metadata: { paymentId: 'pay-3', amount: 25000 } },
  { id: 'bh-12', brandId: 'brand-4', fecha: '2025-10-12', tipo: 'milestone', resumen: 'Cliente adquirido', metadata: {} },
  { id: 'bh-13', brandId: 'brand-4', fecha: '2025-11-05', tipo: 'invoice', resumen: 'Factura INV-2025-006 emitida (€4,500)', metadata: { invoiceId: 'inv-8' } },
  { id: 'bh-14', brandId: 'brand-4', fecha: '2025-10-10', tipo: 'invoice', resumen: 'Factura INV-2025-004 emitida (€7,700)', metadata: { invoiceId: 'inv-5' } },
];

const influencerHistories: InfluencerHistory[] = [
  { id: 'ih-1', influencerId: 'inf-2', projectId: 'proj-1', brandId: 'brand-1', fecha: '2025-09-10', metrica: 'impressions', valor: 520000, notas: 'Primera publicación' },
  { id: 'ih-2', influencerId: 'inf-2', projectId: 'proj-1', brandId: 'brand-1', fecha: '2025-09-15', metrica: 'engagement', valor: 5.2, notas: 'Excelente engagement' },
  { id: 'ih-3', influencerId: 'inf-8', projectId: 'proj-1', brandId: 'brand-1', fecha: '2025-09-12', metrica: 'impressions', valor: 210000, notas: 'Video unboxing' },
  { id: 'ih-4', influencerId: 'inf-1', projectId: 'proj-2', brandId: 'brand-2', fecha: '2025-10-05', metrica: 'impressions', valor: 310000, notas: 'Fashion showcase' },
  { id: 'ih-5', influencerId: 'inf-1', projectId: 'proj-2', brandId: 'brand-2', fecha: '2025-10-08', metrica: 'engagement', valor: 6.5, notas: 'Alto engagement' },
  { id: 'ih-6', influencerId: 'inf-3', projectId: 'proj-3', brandId: 'brand-3', fecha: '2025-09-18', metrica: 'impressions', valor: 280000, notas: 'Challenge inicio' },
  { id: 'ih-7', influencerId: 'inf-5', projectId: 'proj-5', brandId: 'brand-4', fecha: '2025-10-15', metrica: 'impressions', valor: 195000, notas: 'Home tour 1' },
  { id: 'ih-8', influencerId: 'inf-5', projectId: 'proj-5', brandId: 'brand-4', fecha: '2025-10-20', metrica: 'engagement', valor: 4.8, notas: 'Buen feedback' },
  { id: 'ih-9', influencerId: 'inf-2', projectId: 'proj-4', brandId: 'brand-1', fecha: '2025-11-15', metrica: 'impressions', valor: 480000, notas: 'Campaña Q4' },
  { id: 'ih-10', influencerId: 'inf-3', projectId: 'proj-7', brandId: 'brand-3', fecha: '2026-01-05', metrica: 'impressions', valor: 340000, notas: 'New Year campaign' },
  { id: 'ih-11', influencerId: 'inf-3', projectId: 'proj-7', brandId: 'brand-3', fecha: '2026-01-10', metrica: 'engagement', valor: 5.8, notas: 'Excelente respuesta' },
  { id: 'ih-12', influencerId: 'inf-5', projectId: 'proj-8', brandId: 'brand-4', fecha: '2025-11-12', metrica: 'impressions', valor: 185000, notas: 'Design tips serie 1' },
];

export const seedData = {
  brands,
  brandContacts,
  people,
  influencers,
  projects,
  projectInfluencers,
  tasks,
  invoices,
  payments,
  brandHistories,
  influencerHistories,
};

