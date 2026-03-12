import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const STATUS_CONFIG = {
    'payé': { color: 'neon-green', icon: 'ph-check-circle', label: 'Payé' },
    'en attente': { color: 'neon-orange', icon: 'ph-clock', label: 'En attente' },
    'échoué': { color: '#ff4b4b', icon: 'ph-warning-circle', label: 'Échoué' }
};

export default function Payments({ showToast }) {
    const { transactions, members, addTransaction, currentMonthRevenue } = useAppStore();
    const [filter, setFilter] = useState('Tous');

    // Simulate capturing a payment
    const handleSimulatePayment = () => {
        const randomMember = members[Math.floor(Math.random() * members.length)];
        const amount = [15, 29, 49, 89][Math.floor(Math.random() * 4)];
        const isSuccess = Math.random() > 0.1; // 90% success rate

        const newTx = {
            id: Date.now(),
            memberId: randomMember ? randomMember.id : 0,
            amount,
            date: new Date().toISOString().split('T')[0],
            status: isSuccess ? 'payé' : 'échoué'
        };

        addTransaction(newTx);
        if (isSuccess) {
            showToast(`Paiement de ${amount}€ reçu de ${randomMember?.name}`, 'success');
        } else {
            showToast(`Échec du paiement de ${amount}€ pour ${randomMember?.name}`, 'error');
        }
    };

    const handleRemind = (memberId) => {
        showToast('Email de relance envoyé au membre !', 'info');
    };

    // Obtenir les infos du membre pour l'affichage
    const enrichedTransactions = transactions.map(t => {
        const member = members.find(m => m.id === t.memberId) || { name: 'Membre inconnu', email: '' };
        return { ...t, member };
    });

    const filtered = enrichedTransactions.filter(t =>
        filter === 'Tous' ? true : t.status === filter.toLowerCase()
    );

    const pendingAmount = transactions.filter(t => t.status !== 'payé').reduce((sum, t) => sum + t.amount, 0);

    return (
        <section className="dashboard-area">
            <div className="page-title-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Caisse & Transactions</h1>
                    <p>Suivez vos encaissements et gérez les impayés.</p>
                </div>
                <button className="add-member-btn" onClick={handleSimulatePayment} style={{ background: 'linear-gradient(135deg, var(--neon-blue), #00a2ff)' }}>
                    <i className="ph ph-credit-card"></i> Simuler Paiement
                </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '16px' }}>
                <div className="stat-card glass-panel" style={{ padding: '20px' }}>
                    <div className="stat-icon neon-green" style={{ width: '48px', height: '48px', fontSize: '24px' }}><i className="ph ph-wallet"></i></div>
                    <div className="stat-details">
                        <h3 style={{ fontSize: '24px' }}>{currentMonthRevenue.toLocaleString()} €</h3>
                        <p>Encaissé ce mois</p>
                    </div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '20px', borderLeft: '3px solid #ff4b4b' }}>
                    <div className="stat-icon" style={{ background: 'rgba(255,75,75,0.1)', color: '#ff4b4b', border: '1px solid rgba(255,75,75,0.2)', width: '48px', height: '48px', fontSize: '24px' }}><i className="ph ph-warning"></i></div>
                    <div className="stat-details">
                        <h3 style={{ fontSize: '24px' }}>{pendingAmount.toLocaleString()} €</h3>
                        <p>En attente / Échoué</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel members-table-wrapper">
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                    {['Tous', 'Payé', 'En attente', 'Échoué'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`tab ${filter === f ? 'active' : ''}`}
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Référence</th>
                            <th>Membre</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    Aucune transaction trouvée.
                                </td>
                            </tr>
                        ) : filtered.map(tx => {
                            const config = STATUS_CONFIG[tx.status] || STATUS_CONFIG['en attente'];
                            return (
                                <tr key={tx.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        #{tx.id.toString().slice(-6)}
                                    </td>
                                    <td>
                                        <div className="member-cell">
                                            <div>
                                                <span className="member-name">{tx.member.name}</span>
                                                <span className="member-email">{tx.member.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{tx.date}</td>
                                    <td style={{ fontWeight: 600 }}>{tx.amount} €</td>
                                    <td>
                                        <span className="status-badge" style={{
                                            background: config.color === '#ff4b4b' ? 'rgba(255,75,75,0.1)' : `rgba(var(--${config.color}-rgb, 0,255,136), 0.1)`,
                                            color: config.color === '#ff4b4b' ? '#ff4b4b' : `var(--${config.color})`,
                                            border: `1px solid ${config.color === '#ff4b4b' ? 'rgba(255,75,75,0.2)' : `rgba(var(--${config.color}-rgb, 0,255,136), 0.2)`}`
                                        }}>
                                            <i className={`ph ${config.icon}`}></i> {config.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="action-btn" title="Télécharger Reçu">
                                                <i className="ph ph-download-simple"></i>
                                            </button>
                                            {tx.status !== 'payé' && (
                                                <button className="action-btn" title="Relancer" onClick={() => handleRemind(tx.memberId)}>
                                                    <i className="ph ph-envelope-simple"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
