import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Navigation';
import { AdminLayout } from './admin/components/AdminLayout';
import { FeedPage } from './pages/FeedPage';
import { CompetePage } from './pages/CompetePage';
import { TrainPage } from './pages/TrainPage';
import { ConnectPage } from './pages/ConnectPage';
import { ProfilePage } from './pages/ProfilePage';
import { MeetsPage } from './admin/pages/MeetsPage';
import MeetDashboard from './admin/components/meets/MeetDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main App Routes - Use the Layout component */}
        <Route path="/" element={
          <Layout>
            <FeedPage />
          </Layout>
        } />
        <Route path="/compete" element={
          <Layout>
            <CompetePage />
          </Layout>
        } />
        <Route path="/train" element={
          <Layout>
            <TrainPage />
          </Layout>
        } />
        <Route path="/connect" element={
          <Layout>
            <ConnectPage />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        
        {/* Admin Director Routes - Individual routes wrapped in AdminLayout */}
        <Route path="/admin/director/dashboard" element={
          <AdminLayout>
            <div className="text-white">Dashboard Coming Soon</div>
          </AdminLayout>
        } />
        <Route path="/admin/director/meets" element={
          <AdminLayout>
            <MeetsPage />
          </AdminLayout>
        } />
        <Route path="/admin/director/meets/:meetId" element={
          <AdminLayout>
            <MeetDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/director/live" element={
          <AdminLayout>
            <div className="text-white">Live Meet Coming Soon</div>
          </AdminLayout>
        } />
        <Route path="/admin/director/finances" element={
          <AdminLayout>
            <div className="text-white">Finances Coming Soon</div>
          </AdminLayout>
        } />
        <Route path="/admin/director/communications" element={
          <AdminLayout>
            <div className="text-white">Communications Coming Soon</div>
          </AdminLayout>
        } />
        <Route path="/admin/director/reports" element={
          <AdminLayout>
            <div className="text-white">Reports Coming Soon</div>
          </AdminLayout>
        } />
        <Route path="/admin/director/settings" element={
          <AdminLayout>
            <div className="text-white">Settings Coming Soon</div>
          </AdminLayout>
        } />
        
        {/* Redirect /admin and /admin/director to meets */}
        <Route path="/admin" element={<Navigate to="/admin/director/meets" replace />} />
        <Route path="/admin/director" element={<Navigate to="/admin/director/meets" replace />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;