import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const PLAN_COLORS = {
    Premium: 'neon-green',
    Standard: 'neon-blue',
    Étudiant: 'neon-orange',
    Jour: 'text-muted',
};

const STATUS_STYLES = {
    actif: { cls: 'active', icon: 'ph-check-circle', label: 'Actif' },
    expiré: { cls: 'expired', icon: 'ph-clock', label: 'Expiré' },
    résiliation: { cls: 'inactive', icon: 'ph-x-circle', label: 'Résiliation' },
    suspendu: { cls: 'suspended', icon: 'ph-warning', label: 'Suspendu' },
};

export default function Members({ showToast }) {
    const { members, addMember, deleteMember } = useAppStore();
    const [search, setSearch] = useState('');
    const [filterPlan, setFilterPlan] = useState('Tous');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', plan: 'Standard' });

    const filtered = members.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchPlan = filterPlan === 'Tous' || m.plan === filterPlan;
        return matchSearch && matchPlan;
    });

    const handleAdd = () => {
        if (!form.name || !form.email) return;
        const newMember = {
            id: Date.now(),
            name: form.name,
            email: form.email,
            plan: form.plan,
            status: 'actif',
            joined: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            avatar: Math.floor(Math.random() * 70) + 1,
        };
        addMember(newMember);
        setForm({ name: '', email: '', plan: 'Standard' });
        setShowModal(false);
        showToast('Membre ajouté avec succès !', 'success');
    };

    const handleDelete = (id) => {
        deleteMember(id);
        showToast('Membre supprimé.', 'info');
    };

    return (
        <section className="dashboard-area">
            <div className="page-title-area">
                <h1>Membres</h1>
                <p>Gérez les profils et abonnements de vos {members.length} adhérents.</p>
            </div>

            {/* TOOLBAR */}
            <div className="members-toolbar glass-panel">
                <div className="search-bar" style={{ flex: 1, maxWidth: '380px' }}>
                    <i className="ph ph-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    {['Tous', 'Premium', 'Standard', 'Étudiant', 'Jour'].map((p) => (
                        <button
                            key={p}
                            className={`tab ${filterPlan === p ? 'active' : ''}`}
                            onClick={() => setFilterPlan(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <button className="add-member-btn" onClick={() => setShowModal(true)}>
                    <i className="ph ph-user-plus"></i> Ajouter
                </button>
            </div>

            {/* TABLE */}
            <div className="glass-panel members-table-wrapper">
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Membre</th>
                            <th>Plan</th>
                            <th>Statut</th>
                            <th>Membre depuis</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <i className="ph ph-magnifying-glass" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                                    Aucun membre trouvé.
                                </td>
                            </tr>
                        ) : filtered.map((m) => {
                            const s = STATUS_STYLES[m.status] || STATUS_STYLES['actif'];
                            return (
                                <tr key={m.id}>
                                    <td>
                                        <div className="member-cell">
                                            <img src={`https://i.pravatar.cc/40?img=${m.avatar}`} alt={m.name} className="avatar" />
                                            <div>
                                                <span className="member-name">{m.name}</span>
                                                <span className="member-email">{m.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`plan-badge ${PLAN_COLORS[m.plan] || ''}`}>{m.plan}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${s.cls}`}>
                                            <i className={`ph ${s.icon}`}></i>{s.label}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{m.joined}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="action-btn" title="Voir le profil">
                                                <i className="ph ph-eye"></i>
                                            </button>
                                            <button className="action-btn danger" title="Supprimer" onClick={() => handleDelete(m.id)}>
                                                <i className="ph ph-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ADD MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Ajouter un Membre</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="ph ph-x"></i>
                            </button>
                        </div>
                        <div className="login-form">
                            <div className="form-group">
                                <label>Nom complet</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-user"></i>
                                    <input placeholder="Jean Dupont" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-envelope-simple"></i>
                                    <input type="email" placeholder="jean@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Plan d'abonnement</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-medal"></i>
                                    <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px' }}>
                                        <option value="Standard" style={{ background: '#1a1f2e' }}>Standard</option>
                                        <option value="Premium" style={{ background: '#1a1f2e' }}>Premium</option>
                                        <option value="Étudiant" style={{ background: '#1a1f2e' }}>Étudiant</option>
                                        <option value="Jour" style={{ background: '#1a1f2e' }}>Jour</option>
                                    </select>
                                </div>
                            </div>
                            <button className="login-btn" onClick={handleAdd}>
                                <i className="ph ph-user-plus"></i> Créer le membre
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
