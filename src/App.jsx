import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import Tasks from './pages/Tasks';
import CompanionPage from './pages/CompanionPage';
import AIAnalysis from './pages/AIAnalysis';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="companion" element={<CompanionPage />} />
            <Route path="ai-analysis/:taskId" element={<AIAnalysis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
