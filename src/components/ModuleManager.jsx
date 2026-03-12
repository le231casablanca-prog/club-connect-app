import { useState } from 'react';
import ModuleCard from './ModuleCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MODULES_DATA = [
    { id: 'mod-1', title: 'Réservations en Ligne', description: "Permet aux membres de réserver leurs séances de coaching ou cours collectifs directement depuis l'application.", iconClass: 'ph-calendar-check', category: 'membres', active: true, theme: 'neon-green' },
    { id: 'mod-2', title: 'Gestion des Abonnements', description: 'Automatisez la facturation, les prélèvements SEPA et la relance des impayés.', iconClass: 'ph-credit-card', category: 'paiements', active: true, theme: 'neon-blue' },
    { id: 'mod-3', title: "Contrôle d'Accès (Portique)", description: "Gérez l'ouverture des portes via QR code, carte RFID ou Bluetooth biométrique.", iconClass: 'ph-door', category: 'gestion', active: true, theme: 'neon-orange' },
    { id: 'mod-4', title: "Programme d'Entraînement", description: "Création et assignation de plans d'entraînement personnalisés pour chaque adhérent.", iconClass: 'ph-barbell', category: 'membres', active: false, theme: 'neon-blue' },
    { id: 'mod-5', title: 'Boutique & Caisse (POS)', description: "Vendez des boissons, compléments et vêtements directement à l'accueil.", iconClass: 'ph-storefront', category: 'paiements', active: false, theme: 'neon-green' },
    { id: 'mod-6', title: 'Marketing Automation', description: 'Envoi ciblé de SMS, emails et notifications push pour fidéliser vos clients.', iconClass: 'ph-envelope-simple', category: 'gestion', active: true, theme: 'neon-orange' },
];

const FILTER_TABS = ['Tous', 'Gestion', 'Membres', 'Paiements'];

export default function ModuleManager({ showToast }) {
    const [modules, setModules] = useLocalStorage('le231backoffice_modules', MODULES_DATA);
    const [activeFilter, setActiveFilter] = useState('Tous');

    const handleToggle = (id) => {
        setModules((prev) =>
            prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
        );
    };

    const filteredModules =
        activeFilter === 'Tous'
            ? modules
            : modules.filter((m) => m.category.toLowerCase() === activeFilter.toLowerCase());

    const activeCount = modules.filter((m) => m.active).length;

    return (
        <section className="dashboard-area">
            <div className="page-title-area">
                <h1>Module Manager</h1>
                <p>Gérez et activez les fonctionnalités de votre salle de sport.</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon neon-green"><i className="ph ph-check-circle"></i></div>
                    <div className="stat-details"><h3>{activeCount}</h3><p>Modules Actifs</p></div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon neon-orange"><i className="ph ph-puzzle-piece"></i></div>
                    <div className="stat-details"><h3>5</h3><p>Extensions Disponibles</p></div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon neon-blue"><i className="ph ph-users-three"></i></div>
                    <div className="stat-details"><h3>89%</h3><p>Taux d'Engagement</p></div>
                </div>
            </div>

            {/* MODULE LISTING */}
            <div className="modules-section">
                <div className="section-header">
                    <h2>Modules Principaux</h2>
                    <div className="filter-tabs">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab}
                                className={`tab ${activeFilter === tab ? 'active' : ''}`}
                                onClick={() => setActiveFilter(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modules-grid">
                    {filteredModules.map((mod) => (
                        <ModuleCard key={mod.id} module={mod} onToggle={handleToggle} />
                    ))}
                </div>
            </div>
        </section>
    );
}
