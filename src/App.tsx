import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { InfluencersPage } from './pages/InfluencersPage';
import { InfluencerDetailPage } from './pages/InfluencerDetailPage';
import { PeoplePage } from './pages/PeoplePage';
import { InvoicesPage } from './pages/InvoicesPage';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
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
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

