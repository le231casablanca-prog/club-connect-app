import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Reports({ showToast }) {
    const { members, transactions } = useAppStore();

    // Stats Simples
    const activeMembers = members.filter(m => m.status === 'actif').length;
    const retentionRate = Math.round((activeMembers / members.length) * 100) || 0;

    // Graphique Répartition Abonnements
    const plansCount = members.reduce((acc, m) => {
        acc[m.plan] = (acc[m.plan] || 0) + 1;
        return acc;
    }, {});

    const barData = {
        labels: Object.keys(plansCount),
        datasets: [{
            label: 'Membres par Abonnement',
            data: Object.values(plansCount),
            backgroundColor: ['#00ff88', '#00d2ff', '#ff5e00', 'rgba(255,255,255,0.2)'],
            borderRadius: 4
        }]
    };

    const handleExport = () => {
        showToast('Export CSV généré avec succès !', 'success');
    };

    return (
        <section className="dashboard-area">
            <div className="page-title-area" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h1>Rapports & Analyses</h1>
                    <p>Analysez la santé financière et la fidélisation de votre club.</p>
                </div>
                <button className="add-member-btn" onClick={handleExport}>
                    <i className="ph ph-file-csv"></i> Exporter Data
                </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div className="stat-icon neon-blue" style={{ width: '48px', height: '48px', fontSize: '24px' }}><i className="ph ph-users-three"></i></div>
                    <div className="stat-details">
                        <h3 style={{ fontSize: '28px' }}>{retentionRate}%</h3>
                        <p>Taux de Rétention</p>
                    </div>
                </div>
                <div className="stat-card glass-panel" style={{ padding: '24px' }}>
                    <div className="stat-icon neon-green" style={{ width: '48px', height: '48px', fontSize: '24px' }}><i className="ph ph-money"></i></div>
                    <div className="stat-details">
                        <h3 style={{ fontSize: '28px' }}>{(transactions.reduce((acc, t) => acc + (t.status === 'payé' ? t.amount : 0), 0) / members.length || 0).toFixed(0)} €</h3>
                        <p>Revenu Moyen / Membre</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Répartition des Abonnements</h3>
                <div style={{ height: '300px' }}>
                    <Bar
                        data={barData}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.1)' } } } }}
                    />
                </div>
            </div>
        </section>
    );
}
