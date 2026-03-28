import React from 'react';
import { LogOut, X, XCircle, FileText, MessageCircle, ShoppingCart, Phone, LayoutGrid, Settings, MessageCircleCodeIcon, MessageSquareDot, Newspaper, Bell, HelpCircle } from 'lucide-react';
import SidebarNav, { SidebarNavItem } from './SidebarNav';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const PostsPage = React.lazy(() => import('../pages/PostsPage'));

interface HomePageProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('posts');
  const location = useLocation();
  const navigate = useNavigate();

  

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItems: SidebarNavItem[] = [
    { id: 'posts', label: 'Bài viết', icon: Newspaper, path: '/posts' },
    { id: 'comments', label: 'Bình luận', icon: MessageSquareDot, path: '/comments' },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, path: '/orders' },
    { id: 'call-settings', label: 'Cài đặt', icon: Settings, path: '/call-settings' }
  ];

  React.useEffect(() => {
    const segment = location.pathname.split('/')[1] || 'posts';
    setActiveTab(segment);
  }, [location.pathname]);

  React.useEffect(() => {
    if (activeTab) {
      try {
        localStorage.setItem('lastTab', activeTab);
      } catch {
        // ignore
      }
    }
  }, [activeTab]);

  // Nội dung được render thông qua nested routes (Outlet)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0a0e1a] to-[#070b13] relative flex">
      {/* Sidebar Navigation */}
      <div className="w-56 border-r border-slate-200 flex flex-col min-h-screen" style={{ backgroundColor: '#f2f6fa' }}>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800 leading-tight">Quản trị</h2>
              <p className="text-xs text-slate-500">Hệ thống</p>
            </div>
          </div>
        </div>

        <SidebarNav
          items={navItems}
          activeId={activeTab}
          onSelect={(id) => {
            setActiveTab(id);
            const item = navItems.find((i) => i.id === id);
            if (item?.path) navigate(item.path);
          }}
        />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center">
                {/* Bell Icon */}
                <button
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Thông báo"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Help Circle Icon */}
                <button
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all duration-200 ml-3 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  title="Trợ giúp"
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                </button>

                {/* Blue Divider */}
                <div className="w-px h-5 bg-blue-400 mx-5"></div>

                {/* Admin User Info */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                    <p className="text-[10px] text-blue-500 font-medium">QUẢN TRỊ VIÊN</p>
                  </div>
                  <img
                    src="https://cafefcdn.com/203337114487263232/2025/9/26/1-1758854125194-1758854126414850352284.png"
                    alt="Admin Avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-3"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1" style={{ backgroundColor: '#f5f7fa' }}>
          <div className="bg-white rounded-2xl m-6">
            <React.Suspense
              fallback={
                <div className="p-8 text-center text-slate-400">Đang tải nội dung...</div>
              }
            >
              {/* Khi dùng nested routes, ưu tiên Outlet; fallback render theo state để giữ tương thích */}
              {location.pathname === '/' ? (
                <PostsPage />
              ) : (
                <Outlet />
              )}
            </React.Suspense>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-slate-100">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: '#fef2f2' }}
            >
              <LogOut className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
              Xác nhận đăng xuất
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-sm text-center mb-6">
              Bạn có chắc chắn muốn đăng xuất?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 text-sm"
              >
                <XCircle className="w-4 h-4" />
                Hủy
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;