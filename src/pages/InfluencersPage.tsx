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

export function InfluencersPage() {
  const { influencers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInfluencers = influencers.filter((inf) =>
    inf.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inf.etiquetas.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Influencers</h1>
          <p className="text-muted-foreground">Gestiona tu red de influencers</p>
        </div>
        <Button onClick={() => {/* TODO: Create dialog */}}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Influencer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o etiquetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Influencers ({filteredInfluencers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Plataformas</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Tarifa Base</TableHead>
                <TableHead>Etiquetas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell className="font-medium">
                    <Link to={`/influencers/${influencer.id}`} className="hover:underline">
                      {influencer.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{influencer.plataformas.join(', ')}</TableCell>
                  <TableCell>{influencer.alcance.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(influencer.tarifaBase)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {influencer.etiquetas.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {influencer.etiquetas.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{influencer.etiquetas.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/influencers/${influencer.id}`}>
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

