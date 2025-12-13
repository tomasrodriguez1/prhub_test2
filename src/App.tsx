import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ThemeProvider } from './components/ThemeProvider';

// Lazy loading de páginas
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then(m => ({ default: m.BrandsPage })));
const BrandDetailPage = lazy(() => import('./pages/BrandDetailPage').then(m => ({ default: m.BrandDetailPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const InfluencersPage = lazy(() => import('./pages/InfluencersPage').then(m => ({ default: m.InfluencersPage })));
const InfluencerDetailPage = lazy(() => import('./pages/InfluencerDetailPage').then(m => ({ default: m.InfluencerDetailPage })));
const PeoplePage = lazy(() => import('./pages/PeoplePage').then(m => ({ default: m.PeoplePage })));
const InvoicesPage = lazy(() => import('./pages/InvoicesPage').then(m => ({ default: m.InvoicesPage })));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:id" element={<BrandDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/influencers" element={<InfluencersPage />} />
              <Route path="/influencers/:id" element={<InfluencerDetailPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

