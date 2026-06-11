import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import DocsPage from './pages/DocsPage';
import DemoLayout from './pages/DemoLayout';
import CounterDemoPage from './pages/CounterDemoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<Navigate to="/demo/counter" replace />} />
          <Route path="counter" element={<CounterDemoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
