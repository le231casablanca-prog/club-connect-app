import { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './hooks/useAppStore';
import { supabase } from './lib/supabaseClient';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ModuleManager from './components/ModuleManager';
import Members from './components/Members';
import Schedule from './components/Schedule';
import Payments from './components/Payments';
import MemberApp from './components/MemberApp';
import Reports from './components/Reports';
import Marketing from './components/Marketing';
import Training from './components/Training';
import SalesCategories from './components/SalesCategories';
import Concepts from './components/Concepts';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import { useToast, ToastContainer } from './components/Toast';
import './index.css';

function AppContent({ user, handleLogout, setIsMemberView, isMemberView }) {
  const { loading } = useAppStore();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts, showToast } = useToast();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
        <i className="ph ph-spinner-gap" style={{ fontSize: '48px', color: 'var(--neon-blue)', animation: 'spin 1s linear infinite' }}></i>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Connexion au serveur...</p>
      </div>
    );
  }

  const pageComponents = {
    dashboard: <Dashboard />,
    calendrier: <Schedule showToast={showToast} />,
    paiements: <Payments showToast={showToast} />,
    rapports: <Reports showToast={showToast} />,
    marketing: <Marketing showToast={showToast} />,
    formations: <Training showToast={showToast} />,
    concepts: <Concepts showToast={showToast} />,
    ventes: <SalesCategories showToast={showToast} />,
    modules: <ModuleManager showToast={showToast} />,
    membres: <Members showToast={showToast} />,
    paramètres: <Settings showToast={showToast} />,
  };

  return (
    <>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      {isMemberView ? (
        <MemberApp user={{ email: user.email }} onBackToAdmin={() => setIsMemberView(false)} showToast={showToast} />
      ) : (
        <div className="app-container">
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
          <Sidebar
            activePage={activePage}
            onNavigate={(p) => {
              setActivePage(p);
              setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
          />
          <main className="main-content">
            <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} onSwitchToMember={() => setIsMemberView(true)} />
            {pageComponents[activePage] || pageComponents['dashboard']}
          </main>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null); // On commence sans utilisateur (pas de login automatique)
  const [isMemberView, setIsMemberView] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  // Fallback toast if needed outside provider, though we moved it inside AppContent for cleaner architecture
  const { toasts, showToast } = useToast();

  useEffect(() => {
    // 1. Vérifier s'il y a déjà une session active au lancement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || 'Administrateur',
          role: 'Super Admin',
          email: session.user.email,
          id: session.user.id
        });
      }
      setAppLoading(false);
    });

    // 2. Écouter les évènements de connexion / déconnexion en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || 'Administrateur',
          role: 'Super Admin',
          email: session.user.email,
          id: session.user.id
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (appLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
        <i className="ph ph-spinner-gap" style={{ fontSize: '48px', color: 'var(--neon-blue)', animation: 'spin 1s linear infinite' }}></i>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Vérification de l'accès sécurisé...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <AppProvider>
      <AppContent user={user} handleLogout={handleLogout} setIsMemberView={setIsMemberView} isMemberView={isMemberView} />
    </AppProvider>
  );
}

export default App;
