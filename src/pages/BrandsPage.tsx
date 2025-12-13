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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Select } from '../components/ui/select';

export function BrandsPage() {
  const { brands, invoices } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brand.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBrandRevenue = (brandId: string) => {
    return invoices
      .filter((inv) => inv.brandId === brandId)
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marcas</h1>
          <p className="text-muted-foreground">Gestiona tus marcas y clientes</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Marca
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="prospect">Prospectos</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Marcas ({filteredBrands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Facturado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">
                    <Link to={`/brands/${brand.id}`} className="hover:underline">
                      {brand.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{brand.sector}</TableCell>
                  <TableCell>{brand.pais}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        brand.estado === 'active'
                          ? 'default'
                          : brand.estado === 'inactive'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {brand.estado === 'active' ? 'Activa' : brand.estado === 'inactive' ? 'Inactiva' : 'Prospecto'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(getBrandRevenue(brand.id))}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/brands/${brand.id}`}>
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Marca</DialogTitle>
            <DialogDescription>Agrega una nueva marca a tu cartera de clientes</DialogDescription>
          </DialogHeader>
          <CreateBrandForm onClose={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateBrandForm({ onClose }: { onClose: () => void }) {
  const { addBrand } = useStore();
  const [formData, setFormData] = useState({
    nombre: '',
    sector: '',
    pais: 'España',
    estado: 'active' as const,
    notas: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBrand(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <Input
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Sector</label>
        <Input
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">País</label>
        <Input
          value={formData.pais}
          onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Estado</label>
        <Select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
        >
          <option value="active">Activa</option>
          <option value="inactive">Inactiva</option>
          <option value="prospect">Prospecto</option>
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
        <Button type="submit">Crear</Button>
      </div>
    </form>
  );
}

