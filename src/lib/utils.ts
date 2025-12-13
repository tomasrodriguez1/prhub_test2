import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateLong(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getDaysUntil(date: string): number {
  const today = new Date();
  const target = new Date(date);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateDSO(invoices: { fecha: string; estado: string }[]): number {
  const paidInvoices = invoices.filter((inv) => inv.estado === 'paid');
  if (paidInvoices.length === 0) return 0;
  
  const totalDays = paidInvoices.reduce((sum) => {
    // Simulación: asumimos que el pago fue 30 días después de la factura
    return sum + 30;
  }, 0);
  
  return Math.round(totalDays / paidInvoices.length);
}

