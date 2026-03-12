import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';

export default function Marketing({ showToast }) {
    const { members } = useAppStore();
    const [campaign, setCampaign] = useState({ title: '', message: '', target: 'Tous' });
    const [history, setHistory] = useState([
        { id: 1, date: '12 Fév', title: 'Promo St-Valentin', target: 'Tous', sent: 145 },
        { id: 2, date: '28 Jan', title: 'Relance Impayés', target: 'Expirés', sent: 12 }
    ]);

    const handleSend = () => {
        if (!campaign.title || !campaign.message) return;

        const count = campaign.target === 'Tous' ? members.length :
            campaign.target === 'Actifs' ? members.filter(m => m.status === 'actif').length :
                members.filter(m => m.status !== 'actif').length;

        const newCamp = {
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            title: campaign.title,
            target: campaign.target,
            sent: count
        };

        setHistory([newCamp, ...history]);
        setCampaign({ title: '', message: '', target: 'Tous' });
        showToast(`Campagne envoyée avec succès à ${count} membres.`, 'success');
    };

    return (
        <section className="dashboard-area">
            <div className="page-title-area">
                <h1>Marketing & Communication</h1>
                <p>Engagez vos membres et augmentez votre rétention avec des campagnes ciblées.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

                {/* CREATE CAMPAIGN */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ph ph-megaphone" style={{ color: 'var(--neon-blue)' }}></i> Nouvelle Campagne
                    </h3>

                    <div className="login-form">
                        <div className="form-group">
                            <label>Sujet de l'Email / SMS</label>
                            <div className="input-wrapper">
                                <i className="ph ph-text-t"></i>
                                <input placeholder="Ex: Offre de parrainage exclusive !" value={campaign.title} onChange={e => setCampaign({ ...campaign, title: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Cible</label>
                            <div className="input-wrapper">
                                <i className="ph ph-target"></i>
                                <select value={campaign.target} onChange={e => setCampaign({ ...campaign, target: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}>
                                    <option value="Tous" style={{ background: '#1a1f2e' }}>Tous les membres</option>
                                    <option value="Actifs" style={{ background: '#1a1f2e' }}>Uniquement les membres Actifs</option>
                                    <option value="Inactifs" style={{ background: '#1a1f2e' }}>Membres Inactifs / Expirés (Relance)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <div className="input-wrapper" style={{ height: 'auto', padding: '12px' }}>
                                <textarea
                                    placeholder="Rédigez votre message ici..."
                                    rows="4"
                                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', resize: 'none' }}
                                    value={campaign.message}
                                    onChange={e => setCampaign({ ...campaign, message: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <button className="login-btn" onClick={handleSend} style={{ width: '100%', marginTop: '10px' }}>
                            <i className="ph ph-paper-plane-right"></i> Envoyer la campagne
                        </button>
                    </div>
                </div>

                {/* HISTORY */}
                <div className="glass-panel" style={{ padding: '0' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ph ph-clock-counter-clockwise" style={{ color: 'var(--neon-green)' }}></i> Historique des envois
                        </h3>
                    </div>
                    <div>
                        {history.map(h => (
                            <div key={h.id} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{h.title}</strong>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}><i className="ph ph-users"></i> {h.target}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--neon-green)' }}>{h.sent} envoyés</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{h.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
