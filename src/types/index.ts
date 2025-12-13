export type BrandStatus = 'active' | 'inactive' | 'prospect';
export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'done';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type ContentStatus = 'draft' | 'submitted' | 'approved' | 'published';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'paypal' | 'other';
export type HistoryType = 'note' | 'project' | 'invoice' | 'payment' | 'milestone';
export type MetricType = 'impressions' | 'clicks' | 'engagement' | 'cost';

export interface Brand {
  id: string;
  nombre: string;
  sector: string;
  pais: string;
  estado: BrandStatus;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandContact {
  id: string;
  brandId: string;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
}

export interface Influencer {
  id: string;
  nombre: string;
  plataformas: string[];
  alcance: number;
  tarifaBase: number;
  etiquetas: string[];
  email?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  brandId: string;
  nombre: string;
  presupuesto: number;
  estado: ProjectStatus;
  fechaInicio: string;
  fechaFin?: string;
  descripcion?: string;
}

export interface ProjectInfluencer {
  projectId: string;
  influencerId: string;
  rol: string;
  costoAcuerdo: number;
  KPIsObjetivo?: Record<string, number>;
}

export interface Task {
  id: string;
  projectId: string;
  titulo: string;
  estado: TaskStatus;
  dueDate?: string;
  descripcion?: string;
  asignadoA?: string;
}

export interface ContentItem {
  id: string;
  projectId: string;
  canal: string;
  titulo: string;
  estado: ContentStatus;
  url?: string;
}

export interface Invoice {
  id: string;
  brandId?: string;
  projectId?: string;
  numero: string;
  fecha: string;
  total: number;
  estado: InvoiceStatus;
  vencimiento?: string;
  concepto?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  fecha: string;
  monto: number;
  metodo: PaymentMethod;
  notas?: string;
}

export interface BrandHistory {
  id: string;
  brandId: string;
  fecha: string;
  tipo: HistoryType;
  resumen: string;
  metadata?: Record<string, unknown>;
}

export interface InfluencerHistory {
  id: string;
  influencerId: string;
  projectId?: string;
  brandId?: string;
  fecha: string;
  metrica: MetricType;
  valor: number;
  notas?: string;
}

export interface Person {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  avatar?: string;
  activo: boolean;
  createdAt: string;
}

