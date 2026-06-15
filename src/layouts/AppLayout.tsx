import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, FolderKanban, Users, FileText, Menu, X, Moon, Sun, Search, UserCircle } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent } from '../components/ui/dialog';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, shortcut: 'g d' },
  { name: 'Marcas', href: '/brands', icon: Building2, shortcut: 'g b' },
  { name: 'Proyectos', href: '/projects', icon: FolderKanban, shortcut: 'g p' },
  { name: 'Influencers', href: '/influencers', icon: Users, shortcut: 'g i' },
  { name: 'Equipo', href: '/people', icon: UserCircle, shortcut: 'g e' },
  { name: 'Facturación', href: '/invoices', icon: FileText, shortcut: 'g f' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Navigation shortcuts (g + key)
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (e2: KeyboardEvent) => {
            if (!e2.metaKey && !e2.ctrlKey) {
              resolve(e2.key);
              window.removeEventListener('keydown', handler);
            }
          };
          window.addEventListener('keydown', handler);
          setTimeout(() => window.removeEventListener('keydown', handler), 1000);
        });

        nextKey.then((key) => {
          const nav = navigation.find((n) => n.shortcut === `g ${key}`);
          if (nav) navigate(nav.href);
        });
      }

      // New item (n)
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        // Will be handled by individual pages
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-bold">PR Hub</h1>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
                {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-lg font-bold">PR Hub</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <h1 className="text-xl font-bold">PR Hub</h1>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={cn('min-h-screen', !isMobile && 'ml-64', isMobile && 'pb-20')}>
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className={cn('border-t bg-card py-4', !isMobile && 'ml-64', isMobile && 'pb-20')}>
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            Made By{' '}
            <a
              href="https://zalantos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              zalantos
            </a>
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card">
          <div className="grid grid-cols-3 gap-1 py-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex min-h-[44px] flex-col items-center justify-center gap-1 text-xs px-1',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="truncate w-full text-center">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Command Palette */}
      <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-2 border-b pb-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar o navegar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mt-2 space-y-1">
            {navigation
              .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setCommandPaletteOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
                  </div>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

