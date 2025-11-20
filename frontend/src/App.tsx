import { useEffect, useMemo, useRef, useState } from 'react';
import { Film, Users, Ticket, Trophy, Store, Calendar, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { Landing } from './components/Landing';
import { Feed } from './components/Feed';
import { CollectionGallery } from './components/CollectionGallery';
import { TheaterManagement } from './components/TheaterManagement';
import { CreatorDashboard } from './components/CreatorDashboard';
import { UserProfile } from './components/UserProfile';
import { EventsPerks } from './components/EventsPerks';
import { WatchHistory } from './components/WatchHistory';
import { Button } from './components/ui/button';
import { useAuth } from './hooks/useAuth';
import type { Role } from './lib/api';

type ViewType = 'home' | 'events' | 'collection' | 'theater' | 'creator' | 'profile' | 'watchHistory';

const DEFAULT_VIEW_BY_ROLE: Record<Role, ViewType> = {
  COLLECTOR: 'home',
  THEATER: 'theater',
  CREATOR: 'creator',
  ADMIN: 'home',
};

const ROLE_LABEL: Record<Role, string> = {
  COLLECTOR: '일반 사용자',
  THEATER: '극장 직원',
  CREATOR: '영화사',
  ADMIN: '관리자',
};

export default function App() {
  const { user, isLoading: authLoading, isReady, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = Boolean(user);
  const userRole: Role = user?.role ?? 'COLLECTOR';
  const prevRoleRef = useRef<Role | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentView('home');
      prevRoleRef.current = null;
      return;
    }

    if (prevRoleRef.current !== userRole) {
      prevRoleRef.current = userRole;
      setCurrentView(DEFAULT_VIEW_BY_ROLE[userRole]);
    }
  }, [isLoggedIn, userRole]);

  const navigation = useMemo(() => ([
    { name: '홈', view: 'home' as ViewType, icon: Film, roles: ['COLLECTOR', 'ADMIN'] as Role[] },
    { name: '이벤트·특전', view: 'events' as ViewType, icon: Sparkles, roles: ['COLLECTOR', 'ADMIN'] as Role[] },
    { name: '내 컬렉션', view: 'collection' as ViewType, icon: Trophy, roles: ['COLLECTOR', 'ADMIN'] as Role[] },
    { name: '극장 관리', view: 'theater' as ViewType, icon: Store, roles: ['THEATER'] as Role[] },
    { name: '이벤트 관리', view: 'creator' as ViewType, icon: Calendar, roles: ['CREATOR'] as Role[] },
    { name: '프로필', view: 'profile' as ViewType, icon: Ticket, roles: ['COLLECTOR', 'ADMIN'] as Role[] },
  ]), []);

  const filteredNav = useMemo(
    () => navigation.filter((item) => item.roles.includes(userRole)),
    [navigation, userRole]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const allowedViews = filteredNav.map((item) => item.view);
    if (!allowedViews.includes(currentView) && allowedViews.length > 0) {
      setCurrentView(allowedViews[0]);
    }
  }, [filteredNav, currentView, isLoggedIn]);

  const renderView = () => {
    if (!isLoggedIn) {
      return <Feed />;
    }
    switch (currentView) {
      case 'home':
        return <Feed />;
      case 'events':
        return <EventsPerks />;
      case 'collection':
        return <CollectionGallery />;
      case 'theater':
        return <TheaterManagement />;
      case 'creator':
        return <CreatorDashboard />;
      case 'profile':
        return <UserProfile onNavigateToWatchHistory={() => setCurrentView('watchHistory')} />;
      case 'watchHistory':
        return <WatchHistory />;
      default:
        return <Feed />;
    }
  };

  if (!isReady || (authLoading && !isLoggedIn)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <Film className="w-12 h-12 mx-auto text-red-600 animate-pulse" />
          <p className="text-gray-400">CineCollector 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Simple Header for Landing */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Film className="w-8 h-8 text-red-600" />
                <span className="text-xl tracking-wider">CINE<span className="text-red-600">COLLECTOR</span></span>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          <Landing />
        </main>

        {/* Footer */}
        <footer className="bg-gray-950 border-t border-red-900/30">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Film className="w-6 h-6 text-red-600" />
                  <span className="tracking-wider">CINE<span className="text-red-600">COLLECTOR</span></span>
                </div>
                <p className="text-gray-400 text-sm">
                  영화 관람 기록과 특전 수집을<br />
                  하나의 플랫폼에서 관리하세요.
                </p>
              </div>
              <div>
                <h3 className="mb-4">주요 기능</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• 영화 관람 기록 관리</li>
                  <li>• 특전 도감 시스템</li>
                  <li>• 실시간 재고 관리</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">프로젝트 정보</h3>
                <p className="text-sm text-gray-400">
                  데이터베이스 프로그래밍 프로젝트<br />
                  임나빈 (202455374)<br />
                  정보컴퓨터공학부 컴퓨터공학전공
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-red-900/30 text-center text-sm text-gray-500">
              © 2025 CineCollector. Database Programming Project.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
              <Film className="w-8 h-8 text-red-600" />
              <span className="text-xl tracking-wider">CINE<span className="text-red-600">COLLECTOR</span></span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentView === item.view
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-red-600/20 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gray-900 border border-red-900/30 rounded-lg text-sm text-gray-300">
                {ROLE_LABEL[userRole]}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-red-900/30">
            <div className="px-4 py-4 space-y-2">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      currentView === item.view
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-red-600/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-red-900/30 space-y-2">
                <div className="w-full bg-gray-800 text-white border border-red-900/30 rounded-lg px-3 py-2 text-center text-sm">
                  {ROLE_LABEL[userRole]}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full border-red-600 text-red-600 hover:bg-red-600/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-red-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-6 h-6 text-red-600" />
                <span className="tracking-wider">CINE<span className="text-red-600">COLLECTOR</span></span>
              </div>
              <p className="text-gray-400 text-sm">
                영화 관람 기록과 특전 수집을<br />
                하나의 플랫폼에서 관리하세요.
              </p>
            </div>
            <div>
              <h3 className="mb-4">주요 기능</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 영화 관람 기록 관리</li>
                <li>• 특전 도감 시스템</li>
                <li>• 실시간 재고 관리</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">프로젝트 정보</h3>
              <p className="text-sm text-gray-400">
                데이터베이스 프로그래밍 프로젝트<br />
                임나빈 (202455374)<br />
                정보컴퓨터공학부 컴퓨터공학전공
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-red-900/30 text-center text-sm text-gray-500">
            © 2025 CineCollector. Database Programming Project.
          </div>
        </div>
      </footer>
    </div>
  );
}