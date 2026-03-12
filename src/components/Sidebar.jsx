const navItems = [
    { icon: 'ph-squares-four', label: 'Dashboard', id: 'dashboard' },
    { icon: 'ph-users', label: 'Membres', id: 'membres' },
    { icon: 'ph-calendar-check', label: 'Planning', id: 'calendrier' },
    { icon: 'ph-credit-card', label: 'Transactions', id: 'paiements' },
    { icon: 'ph-storefront', label: 'Catégories de Vente', id: 'ventes' },
    { icon: 'ph-barbell', label: 'Entraînement', id: 'formations' },
    { icon: 'ph-lightbulb', label: 'Concepts & Coachs', id: 'concepts' },
    { icon: 'ph-puzzle-piece', label: 'Module Manager', id: 'modules' },
    { icon: 'ph-chart-line-up', label: 'Rapports', id: 'rapports' },
    { icon: 'ph-megaphone', label: 'Communication', id: 'marketing' },
];

export default function Sidebar({ activePage, onNavigate, onLogout, isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-circle">
                    <i className="ph ph-crown"></i>
                </div>
                <h2>MANAGYM PREMIÈRE</h2>
            </div>

            <nav className="sidebar-menu">
                {navItems.map((item) => (
                    <a
                        key={item.id}
                        href="#"
                        className={`menu-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                    >
                        <i className={`ph ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                <a
                    href="#"
                    className={`menu-item ${activePage === 'paramètres' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate('paramètres'); }}
                >
                    <i className="ph ph-gear"></i>
                    <span>Paramètres</span>
                </a>
                <a
                    href="#"
                    className="menu-item logout"
                    onClick={(e) => { e.preventDefault(); onLogout(); }}
                >
                    <i className="ph ph-sign-out"></i>
                    <span>Déconnexion</span>
                </a>
            </div>
            <style jsx="true">{`
                .sidebar {
                    background: rgba(15, 23, 42, 0.4) !important;
                    backdrop-filter: blur(24px) !important;
                    border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                }
                .logo-circle {
                    background: linear-gradient(135deg, #10b981, #6366f1) !important;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
                }
                .menu-item.active {
                    background: rgba(16, 185, 129, 0.1) !important;
                    color: #10b981 !important;
                    border: 1px solid rgba(16, 185, 129, 0.2) !important;
                }
            `}</style>
        </aside>
    );
}
