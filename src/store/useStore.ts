import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  TaskStatus,
  InvoiceStatus,
} from '../types';
import { seedData } from '../data/seed';

interface StoreState {
  // Data
  brands: Brand[];
  brandContacts: BrandContact[];
  people: Person[];
  influencers: Influencer[];
  projects: Project[];
  projectInfluencers: ProjectInfluencer[];
  tasks: Task[];
  invoices: Invoice[];
  payments: Payment[];
  brandHistories: BrandHistory[];
  influencerHistories: InfluencerHistory[];

  // Brand actions
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  // Person actions
  addPerson: (person: Omit<Person, 'id' | 'createdAt'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;

  // Influencer actions
  addInfluencer: (influencer: Omit<Influencer, 'id' | 'createdAt'>) => void;
  updateInfluencer: (id: string, updates: Partial<Influencer>) => void;
  deleteInfluencer: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectInfluencer: (pi: ProjectInfluencer) => void;
  removeProjectInfluencer: (projectId: string, influencerId: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;

  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Payment actions
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // History actions (automáticos)
  addBrandHistory: (history: Omit<BrandHistory, 'id'>) => void;
  addInfluencerHistory: (history: Omit<InfluencerHistory, 'id'>) => void;

  // Reset
  resetStore: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state from seed
      brands: seedData.brands,
      brandContacts: seedData.brandContacts,
      people: seedData.people,
      influencers: seedData.influencers,
      projects: seedData.projects,
      projectInfluencers: seedData.projectInfluencers,
      tasks: seedData.tasks,
      invoices: seedData.invoices,
      payments: seedData.payments,
      brandHistories: seedData.brandHistories,
      influencerHistories: seedData.influencerHistories,

      // Brand actions
      addBrand: (brandData) => {
        const now = new Date().toISOString().split('T')[0];
        const newBrand: Brand = {
          ...brandData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          brands: [...state.brands, newBrand],
          brandHistories: [
            ...state.brandHistories,
            {
              id: generateId(),
              brandId: newBrand.id,
              fecha: now,
              tipo: 'milestone',
              resumen: `Marca ${newBrand.nombre} agregada`,
            },
          ],
        }));
      },

      updateBrand: (id, updates) => {
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : b
          ),
        }));
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id),
          projects: state.projects.filter((p) => p.brandId !== id),
          invoices: state.invoices.filter((inv) => inv.brandId !== id),
          brandHistories: state.brandHistories.filter((bh) => bh.brandId !== id),
        }));
      },

      // Person actions
      addPerson: (personData) => {
        const newPerson: Person = {
          ...personData,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          people: [...state.people, newPerson],
        }));
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deletePerson: (id) => {
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
          tasks: state.tasks.map((t) => (t.asignadoA === id ? { ...t, asignadoA: undefined } : t)),
        }));
      },

      // Influencer actions
      addInfluencer: (influencerData) => {
        const newInfluencer: Influencer = {
          ...influencerData,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          influencers: [...state.influencers, newInfluencer],
        }));
      },

      updateInfluencer: (id, updates) => {
        set((state) => ({
          influencers: state.influencers.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },

      deleteInfluencer: (id) => {
        set((state) => ({
          influencers: state.influencers.filter((i) => i.id !== id),
          projectInfluencers: state.projectInfluencers.filter((pi) => pi.influencerId !== id),
          influencerHistories: state.influencerHistories.filter((ih) => ih.influencerId !== id),
        }));
      },

      // Project actions
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: generateId(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          brandHistories: [
            ...state.brandHistories,
            {
              id: generateId(),
              brandId: newProject.brandId,
              fecha: newProject.fechaInicio,
              tipo: 'project',
              resumen: `Proyecto ${newProject.nombre} iniciado`,
              metadata: { projectId: newProject.id },
            },
          ],
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
          projectInfluencers: state.projectInfluencers.filter((pi) => pi.projectId !== id),
          invoices: state.invoices.filter((inv) => inv.projectId !== id),
        }));
        if (project) {
          get().addBrandHistory({
            brandId: project.brandId,
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'note',
            resumen: `Proyecto ${project.nombre} eliminado`,
          });
        }
      },

      addProjectInfluencer: (pi) => {
        set((state) => ({
          projectInfluencers: [...state.projectInfluencers.filter((p) => !(p.projectId === pi.projectId && p.influencerId === pi.influencerId)), pi],
        }));
      },

      removeProjectInfluencer: (projectId, influencerId) => {
        set((state) => ({
          projectInfluencers: state.projectInfluencers.filter(
            (pi) => !(pi.projectId === projectId && pi.influencerId === influencerId)
          ),
        }));
      },

      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      moveTask: (taskId, newStatus) => {
        get().updateTask(taskId, { estado: newStatus });
      },

      // Invoice actions
      addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: generateId(),
        };
        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));
        if (invoiceData.brandId) {
          get().addBrandHistory({
            brandId: invoiceData.brandId,
            fecha: invoiceData.fecha,
            tipo: 'invoice',
            resumen: `Factura ${invoiceData.numero} emitida (${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoiceData.total)})`,
            metadata: { invoiceId: newInvoice.id, amount: invoiceData.total },
          });
        }
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
          payments: state.payments.filter((p) => p.invoiceId !== id),
        }));
      },

      // Payment actions
      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: generateId(),
        };
        const invoice = get().invoices.find((inv) => inv.id === paymentData.invoiceId);
        const totalPaid = get().payments
          .filter((p) => p.invoiceId === paymentData.invoiceId)
          .reduce((sum, p) => sum + p.monto, 0) + paymentData.monto;

        let newStatus: InvoiceStatus = invoice?.estado || 'draft';
        if (totalPaid >= (invoice?.total || 0)) {
          newStatus = 'paid';
        } else if (invoice?.estado === 'draft') {
          newStatus = 'sent';
        }

        set((state) => ({
          payments: [...state.payments, newPayment],
          invoices: state.invoices.map((inv) =>
            inv.id === paymentData.invoiceId ? { ...inv, estado: newStatus } : inv
          ),
        }));

        if (invoice?.brandId) {
          get().addBrandHistory({
            brandId: invoice.brandId,
            fecha: paymentData.fecha,
            tipo: 'payment',
            resumen: `Pago recibido ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(paymentData.monto)}`,
            metadata: { paymentId: newPayment.id, amount: paymentData.monto, invoiceId: invoice.id },
          });
        }
      },

      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id),
        }));
      },

      // History actions
      addBrandHistory: (historyData) => {
        const newHistory: BrandHistory = {
          ...historyData,
          id: generateId(),
        };
        set((state) => ({
          brandHistories: [...state.brandHistories, newHistory],
        }));
      },

      addInfluencerHistory: (historyData) => {
        const newHistory: InfluencerHistory = {
          ...historyData,
          id: generateId(),
        };
        set((state) => ({
          influencerHistories: [...state.influencerHistories, newHistory],
        }));
      },

      // Reset
      resetStore: () => {
        set({
          brands: seedData.brands,
          brandContacts: seedData.brandContacts,
          people: seedData.people,
          influencers: seedData.influencers,
          projects: seedData.projects,
          projectInfluencers: seedData.projectInfluencers,
          tasks: seedData.tasks,
          invoices: seedData.invoices,
          payments: seedData.payments,
          brandHistories: seedData.brandHistories,
          influencerHistories: seedData.influencerHistories,
        });
      },
    }),
    {
      name: 'pr-hub-storage',
      partialize: (state) => ({
        brands: state.brands,
        brandContacts: state.brandContacts,
        people: state.people,
        influencers: state.influencers,
        projects: state.projects,
        projectInfluencers: state.projectInfluencers,
        tasks: state.tasks,
        invoices: state.invoices,
        payments: state.payments,
        brandHistories: state.brandHistories,
        influencerHistories: state.influencerHistories,
      }),
    }
  )
);

