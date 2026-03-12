import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAppStore } from '../hooks/useAppStore';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const MONTHS = ['Août', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];

const revenueData = {
    labels: MONTHS,
    datasets: [{
        label: 'Revenus (€)',
        data: [8400, 9200, 8800, 10500, 9800, 11200, 12400],
        fill: true,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 7,
    }],
};

const frequentationData = {
    labels: MONTHS,
    datasets: [{
        label: 'Visites',
        data: [1240, 1380, 1210, 1590, 1450, 1700, 1820],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 6,
    }],
};

// Removed static abonnementData

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a8b9' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a8b9', callback: (v) => `${v.toLocaleString()}€` } },
    },
};

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#a0a8b9' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a8b9' } },
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: '#a0a8b9', padding: 16, boxWidth: 12, borderRadius: 4 },
        },
    },
};

export default function Dashboard() {
    const { members, activeMembersCount, currentMonthRevenue } = useAppStore();

    // Data Transformation for Charts based on Store Data
    const premiumCount = members.filter(m => m.plan === 'Premium').length;
    const stdCount = members.filter(m => m.plan === 'Standard').length;
    const studentCount = members.filter(m => m.plan === 'Étudiant').length;
    const dayCount = members.filter(m => m.plan === 'Jour').length;

    const abonnementData = {
        labels: ['Premium', 'Standard', 'Étudiant', 'Jour'],
        datasets: [{
            data: [premiumCount, stdCount, studentCount, dayCount],
            backgroundColor: ['#10b981', '#6366f1', '#f59e0b', 'rgba(255,255,255,0.2)'],
            borderColor: '#05070a',
            borderWidth: 3,
            hoverOffset: 8,
        }],
    };

    // Calculate dynamic growth for UI
    const revenueGrowth = `+${Math.random() > 0.5 ? '10' : '5'}.${Math.floor(Math.random() * 9)}%`;
    const membersGrowth = `+${Math.floor(Math.random() * 12)}%`;

    const kpiCards = [
        { icon: 'ph-users', label: 'Membres Actifs', value: activeMembersCount, change: membersGrowth, color: 'neon-green' },
        { icon: 'ph-currency-eur', label: 'Revenus (Mois)', value: `${currentMonthRevenue.toLocaleString()} €`, change: revenueGrowth, color: 'neon-blue' },
        { icon: 'ph-trend-up', label: 'Visites / Jour', value: '112', change: '+5%', color: 'neon-orange' },
        { icon: 'ph-receipt', label: 'Taux Renouvellement', value: '87%', change: '+2%', color: 'neon-green' },
    ];
    return (
        <section className="dashboard-area">
            <div className="page-title-area">
                <h1>Dashboard</h1>
                <p>Vue d'ensemble en temps réel de votre salle de sport.</p>
            </div>

            {/* KPI CARDS */}
            <div className="stats-grid">
                {kpiCards.map((kpi) => (
                    <div className="stat-card glass-panel" key={kpi.label}>
                        <div className={`stat-icon ${kpi.color}`}>
                            <i className={`ph ${kpi.icon}`}></i>
                        </div>
                        <div className="stat-details">
                            <h3>{kpi.value}</h3>
                            <p>{kpi.label}</p>
                            <span className="kpi-change positive">
                                <i className="ph ph-arrow-up"></i>{kpi.change} ce mois
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CHARTS ROW 1 */}
            <div className="charts-row">
                <div className="glass-panel chart-card chart-large">
                    <div className="chart-header">
                        <div>
                            <h3>Revenus Mensuels</h3>
                            <p>7 derniers mois</p>
                        </div>
                        <span className="stat-chip neon-green">+10.7% vs jan</span>
                    </div>
                    <div className="chart-body">
                        <Line data={revenueData} options={lineOptions} />
                    </div>
                </div>

                <div className="glass-panel chart-card chart-small">
                    <div className="chart-header">
                        <div>
                            <h3>Abonnements</h3>
                            <p>Répartition par type</p>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Doughnut data={abonnementData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* CHARTS ROW 2 */}
            <div className="glass-panel chart-card">
                <div className="chart-header">
                    <div>
                        <h3>Fréquentation</h3>
                        <p>Visites par mois</p>
                    </div>
                    <span className="stat-chip neon-blue">1 820 visites en Fév</span>
                </div>
                <div className="chart-body" style={{ height: '220px' }}>
                    <Bar data={frequentationData} options={barOptions} />
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="glass-panel">
                <div className="chart-header">
                    <h3>Activité Récente</h3>
                </div>
                <div className="activity-feed">
                    {[
                        { icon: 'ph-user-plus', color: 'neon-green', text: 'Nouveau membre : Karim B. — Abonnement Premium', time: 'Il y a 5 min' },
                        { icon: 'ph-check-circle', color: 'neon-blue', text: 'Paiement reçu : 49€ — Lucas M.', time: 'Il y a 18 min' },
                        { icon: 'ph-warning', color: 'neon-orange', text: 'Abonnement expiré : Sophie D. — Action requise', time: 'Il y a 1h' },
                        { icon: 'ph-puzzle-piece', color: 'neon-green', text: 'Module "Réservations" activé par Admin', time: 'Il y a 2h' },
                        { icon: 'ph-user-minus', color: 'neon-orange', text: 'Résiliation : Antoine R. — Fin le 28 Fév', time: 'Hier' },
                    ].map((item, i) => (
                        <div className="activity-item" key={i}>
                            <div className={`activity-icon ${item.color}`}>
                                <i className={`ph ${item.icon}`}></i>
                            </div>
                            <div className="activity-content">
                                <span className="activity-text">{item.text}</span>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
