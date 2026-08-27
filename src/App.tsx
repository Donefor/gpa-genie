import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Stats from './pages/Stats';
import Privacy from './pages/Privacy';
import { ConsentBanner } from '@/components/ConsentBanner';
import NotFound from './pages/NotFound';

const App = () => (
  <TooltipProvider delayDuration={200}>
    <Toaster />
    <Sonner />
    <BrowserRouter basename="/">
      <ConsentBanner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
