import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Select } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';

export function InvoicesPage() {
  const { invoices, brands, payments } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brands.find((b) => b.id === inv.brandId)?.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInvoicePaid = (invoiceId: string) => {
    return payments.filter((p) => p.invoiceId === invoiceId).reduce((sum, p) => sum + p.monto, 0);
  };

  const handleRegisterPayment = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
    setPaymentSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facturación</h1>
          <p className="text-muted-foreground">Gestiona facturas y pagos</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="sent">Enviada</option>
              <option value="paid">Pagada</option>
              <option value="overdue">Vencida</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const brand = brands.find((b) => b.id === invoice.brandId);
                const paid = getInvoicePaid(invoice.id);
                const remaining = invoice.total - paid;
                const isOverdue = invoice.vencimiento && new Date(invoice.vencimiento) < new Date() && invoice.estado !== 'paid';

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.numero}</TableCell>
                    <TableCell>{brand?.nombre || 'N/A'}</TableCell>
                    <TableCell>{formatDate(invoice.fecha)}</TableCell>
                    <TableCell>
                      {invoice.vencimiento ? (
                        <span className={isOverdue ? 'text-red-600' : ''}>
                          {formatDate(invoice.vencimiento)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>
                      {formatCurrency(paid)}
                      {remaining > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({formatCurrency(remaining)} pendiente)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.estado === 'paid'
                            ? 'default'
                            : invoice.estado === 'overdue' || isOverdue
                            ? 'destructive'
                            : invoice.estado === 'sent'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {invoice.estado === 'paid'
                          ? 'Pagada'
                          : invoice.estado === 'overdue' || isOverdue
                          ? 'Vencida'
                          : invoice.estado === 'sent'
                          ? 'Enviada'
                          : 'Borrador'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.estado !== 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegisterPayment(invoice.id)}
                        >
                          Registrar Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Factura</DialogTitle>
            <DialogDescription>Crear una nueva factura</DialogDescription>
          </DialogHeader>
          <CreateInvoiceForm onClose={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Payment Sheet */}
      <Sheet open={paymentSheetOpen} onOpenChange={setPaymentSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Registrar Pago</SheetTitle>
          </SheetHeader>
          {selectedInvoice && (
            <RegisterPaymentForm
              invoiceId={selectedInvoice}
              onClose={() => {
                setPaymentSheetOpen(false);
                setSelectedInvoice(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const { brands, projects, addInvoice } = useStore();
  const [formData, setFormData] = useState({
    brandId: '',
    projectId: '',
    numero: '',
    fecha: new Date().toISOString().split('T')[0],
    total: 0,
    estado: 'draft' as const,
    vencimiento: '',
    concepto: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      ...formData,
      brandId: formData.brandId || undefined,
      projectId: formData.projectId || undefined,
      vencimiento: formData.vencimiento || undefined,
      concepto: formData.concepto || undefined,
    });
    onClose();
  };

  const brandProjects = formData.brandId
    ? projects.filter((p) => p.brandId === formData.brandId)
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Marca</label>
        <Select
          value={formData.brandId}
          onChange={(e) => setFormData({ ...formData, brandId: e.target.value, projectId: '' })}
        >
          <option value="">Seleccionar marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.nombre}
            </option>
          ))}
        </Select>
      </div>
      {formData.brandId && (
        <div>
          <label className="text-sm font-medium">Proyecto (opcional)</label>
          <Select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          >
            <option value="">Sin proyecto</option>
            {brandProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nombre}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div>
        <label className="text-sm font-medium">Número</label>
        <Input
          value={formData.numero}
          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Fecha</label>
        <Input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Total</label>
        <Input
          type="number"
          step="0.01"
          value={formData.total}
          onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Estado</label>
        <Select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
        >
          <option value="draft">Borrador</option>
          <option value="sent">Enviada</option>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Vencimiento (opcional)</label>
        <Input
          type="date"
          value={formData.vencimiento}
          onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Concepto</label>
        <Input
          value={formData.concepto}
          onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
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

function RegisterPaymentForm({ invoiceId, onClose }: { invoiceId: string; onClose: () => void }) {
  const { invoices, addPayment } = useStore();
  const invoice = invoices.find((inv) => inv.id === invoiceId);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    monto: invoice ? invoice.total : 0,
    metodo: 'bank_transfer' as const,
    notas: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      invoiceId,
      ...formData,
      notas: formData.notas || undefined,
    });
    onClose();
  };

  if (!invoice) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Factura: {invoice.numero}</p>
        <p className="text-sm text-muted-foreground">Total: {formatCurrency(invoice.total)}</p>
      </div>
      <div>
        <label className="text-sm font-medium">Fecha</label>
        <Input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Monto</label>
        <Input
          type="number"
          step="0.01"
          value={formData.monto}
          onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Método</label>
        <Select
          value={formData.metodo}
          onChange={(e) => setFormData({ ...formData, metodo: e.target.value as any })}
        >
          <option value="bank_transfer">Transferencia Bancaria</option>
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="paypal">PayPal</option>
          <option value="other">Otro</option>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Notas</label>
        <Input
          value={formData.notas}
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Registrar Pago</Button>
      </div>
    </form>
  );
}

