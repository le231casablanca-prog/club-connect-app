export default function Header({ user, onMenuClick, onSwitchToMember }) {
    const displayName = user?.name || 'Admin';
    const displayRole = user?.role || 'Administrateur';

    return (
        <header className="top-header glass-panel border-white/5 shadow-2xl">
            <button className="hamburger-btn text-white/70 hover:text-white" onClick={onMenuClick}>
                <i className="ph ph-list"></i>
            </button>
            <div className="search-bar bg-white/5 border-white/10 focus-within:border-[#10b981]/50 shadow-inner">
                <i className="ph ph-magnifying-glass text-[#475569]"></i>
                <input type="text" placeholder="Rechercher Membre, Session, Facture..." className="placeholder:text-[#475569]" />
            </div>

            <div className="header-actions">
                <button
                    className="action-btn group overflow-hidden relative"
                    onClick={onSwitchToMember}
                    title="Voir l'App Membre"
                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 18px', borderRadius: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="ph ph-device-mobile transition-transform group-hover:scale-110"></i> Vue Membre
                </button>
                <div className="separator" style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.05)', margin: '0 8px' }}></div>
                <button className="icon-btn notification-btn bg-white/5 hover:bg-[#f59e0b]/20 transition-all">
                    <i className="ph ph-bell"></i>
                    <span className="notification-dot bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></span>
                </button>
                <div className="user-profile border-white/5 hover:bg-white/5">
                    <img
                        src="https://i.pravatar.cc/150?img=11"
                        alt="Avatar"
                        className="avatar border-2 border-[#10b981]/30"
                    />
                    <div className="user-info">
                        <span className="user-name text-white font-bold">{displayName}</span>
                        <span className="user-role text-[#94a3b8] font-semibold text-[10px] uppercase tracking-wider">{displayRole}</span>
                    </div>
                </div>
            </div>
            <style jsx="true">{`
                .glass-panel {
                    background: rgba(15, 23, 42, 0.4) !important;
                    backdrop-filter: blur(24px) !important;
                }
            `}</style>
        </header>
    );
}
