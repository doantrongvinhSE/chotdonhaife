import React from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import useAuth from './hooks/useAuth';
import { Navigate, Route, Routes } from 'react-router-dom';
const PostsPage = React.lazy(() => import('./pages/PostsPage'));
const CommentsPage = React.lazy(() => import('./pages/CommentsPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const CallSettingsPage = React.lazy(() => import('./pages/CallSettingsPage'));

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-white text-lg">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  const lastTab = (() => {
    try {
      return localStorage.getItem('lastTab') || 'posts';
    } catch {
      return 'posts';
    }
  })();

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} onLogout={logout} /> }>
        <Route index element={<Navigate to={`/${lastTab}`} replace />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="comments" element={<CommentsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="call-settings" element={<CallSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
}

export default App;