import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuestLayout } from './layouts/GuestLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { GuestLanding } from './pages/GuestLanding';
import { Docs } from './pages/Docs';
import { UserHome } from './pages/UserHome';
import { OCRUpload } from './pages/OCRUpload';
import { DocumentEditor } from './pages/DocumentEditor';
import { DocumentList } from './pages/DocumentList';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/docs" element={<Docs />} />

        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<GuestLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<UserHome />} />
          <Route path="documents" element={<DocumentList />} />
          <Route path="scan" element={<OCRUpload />} />
          <Route path="editor/new" element={<DocumentEditor />} />
          <Route path="settings" element={<div className="p-8">Settings Placeholder</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
