import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './features/shared/layout/athlete/AthleteNavigation';
import { AdminLayout } from './features/shared/layout/admin/AdminLayout';
import { FeedPage } from './features/athlete/pages/feed/FeedPage';
import { CompetePage } from './features/athlete/pages/compete/CompetePage';
import { TrainPage } from './features/athlete/pages/train/TrainPage';
import { ConnectPage } from './features/athlete/pages/connect/ConnectPage';
import { ProfilePage } from './features/athlete/pages/profile/ProfilePage';
import { DashboardPage } from './features/admin/pages/dashboard/DashboardPage';
import { MeetsPage } from './features/admin/pages/meets/MeetsPage';
import { LiveMeetPage } from './features/admin/pages/liveMeet/LiveMeetPage';
import { FinancesPage } from './features/admin/pages/finances/FinancesPage';
import { CommunicationsPage } from './features/admin/pages/communications/CommunicationsPage';
import { ReportsPage } from './features/admin/pages/reports/ReportsPage';
import { SettingsPage as AdminSettingsPage } from './features/admin/pages/settings/SettingsPage';
import MeetDashboard from './features/admin/pages/meets/components/MeetDashboard';
import { EditMeet } from './features/admin/pages/meets/components/EditMeet';
import MeetDetailsPage from './features/athlete/pages/compete/components/MeetDetailsPage';
import LandingPage from './features/shared/LandingPage';
import LoginPage from './features/shared/auth/LoginPage';
import CreateAccountPage from './features/shared/auth/CreateAccountPage';
import EmailVerificationPending from './features/shared/auth/emails/EmailVerificationPending';
import EmailVerification from './features/shared/auth/emails/EmailVerification';
import EmailVerificationSuccess from './features/shared/auth/emails/EmailVerificationSuccess';
import EmailVerificationError from './features/shared/auth/emails/EmailVerificationError';

import { AuthProvider } from './contexts/shared/AuthContext';

import ThemeProvider from './styles/ThemeProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account/:userType" element={<CreateAccountPage />} />
          
          {/* Email Verification Routes */}
          <Route path="/email-verification-pending" element={<EmailVerificationPending />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
          <Route path="/email-verification-error" element={<EmailVerificationError />} />
          
          {/* Main App Routes - Use the Layout component */}
          <Route path="/feed" element={
            <Layout>
              <FeedPage />
            </Layout>
          } />
          <Route path="/compete" element={
            <Layout>
              <CompetePage />
            </Layout>
          } />
          <Route path="/compete/meet/:meetId" element={
            <Layout>
              <MeetDetailsPage />
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
              <DashboardPage />
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
          <Route path="/admin/director/meets/:meetId/edit" element={
            <AdminLayout>
              <EditMeet onComplete={() => window.history.back()} />
            </AdminLayout>
          } />
          <Route path="/admin/director/live" element={
            <AdminLayout>
              <LiveMeetPage />
            </AdminLayout>
          } />
          <Route path="/admin/director/finances" element={
            <AdminLayout>
              <FinancesPage />
            </AdminLayout>
          } />
          <Route path="/admin/director/communications" element={
            <AdminLayout>
              <CommunicationsPage />
            </AdminLayout>
          } />
          <Route path="/admin/director/reports" element={
            <AdminLayout>
              <ReportsPage />
            </AdminLayout>
          } />
          <Route path="/admin/director/settings" element={
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          } />
          
          {/* Redirect /admin and /admin/director to dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/director/dashboard" replace />} />
          <Route path="/admin/director" element={<Navigate to="/admin/director/dashboard" replace />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;