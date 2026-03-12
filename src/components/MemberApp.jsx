import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const INITIAL_SCHEDULE = [
    { id: 1, name: 'CrossFit WOD', day: 'Lundi', time: '18:00', coach: 'Alex', capacity: 15, booked: 12, type: 'neon-orange' },
    { id: 2, name: 'Yoga Vinyasa', day: 'Mardi', time: '10:00', coach: 'Sarah', capacity: 20, booked: 5, type: 'neon-blue' },
    { id: 3, name: 'Spinning Intense', day: 'Mercredi', time: '12:00', coach: 'Mike', capacity: 25, booked: 25, type: 'neon-green' },
];

export default function MemberApp({ user, onBackToAdmin, showToast }) {
    const { members, programs, sessions, exercises } = useAppStore();
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [activeTab, setActiveTab] = useState('home');

    // On récupère le membre connecté (ou le fallback)
    const currentMember = members.find(m => m.email === user?.email) || members[0] || { id: 1, name: 'Utilisateur', avatar: 11, plan: 'Standard' };
    const displayName = currentMember.name ? currentMember.name.split(' ')[0] : 'Utilisateur';

    // Rècupère les programmes assignés à ce membre
    const myPrograms = programs.filter(p => p.assignedTo.includes(currentMember.id));

    const handleBook = (id) => {
        setSchedule(prev => prev.map(c => {
            if (c.id === id && c.booked < c.capacity) {
                showToast(`Inscription confirmée : ${c.name}`, 'success');
                return { ...c, booked: c.booked + 1, isBookedByMe: true };
            }
            if (c.id === id && c.booked >= c.capacity) {
                showToast(`Désolé, le cours ${c.name} est complet.`, 'error');
            }
            return c;
        }));
    };

    return (
        <div className="login-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>

            <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Header Membre */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={`https://i.pravatar.cc/100?img=${currentMember.avatar}`} alt="Avatar" className="avatar" style={{ width: '56px', height: '56px' }} />
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Bonjour, {displayName} 👋</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Abonnement {currentMember.plan}</p>
                        </div>
                    </div>
                    <button className="icon-btn" onClick={onBackToAdmin} title="Retourner à l'administration" style={{ border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>
                        <i className="ph ph-shield-star"></i>
                    </button>
                </div>

                {/* Tabs / Navigation Interne */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                    <button
                        onClick={() => setActiveTab('home')}
                        style={{ background: activeTab === 'home' ? 'var(--neon-blue)' : 'transparent', color: activeTab === 'home' ? '#000' : 'var(--text-secondary)', border: 'none', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Accueil
                    </button>
                    <button
                        onClick={() => setActiveTab('programs')}
                        style={{ background: activeTab === 'programs' ? 'var(--neon-blue)' : 'transparent', color: activeTab === 'programs' ? '#000' : 'var(--text-secondary)', border: 'none', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Mes Entraînements
                    </button>
                </div>

                {/* --- VUE ACCUEIL --- */}
                {activeTab === 'home' && (
                    <>
                        {/* QR Code Virtuel */}
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '100px', height: '100px', background: 'var(--neon-green)', filter: 'blur(50px)', zIndex: 0 }}></div>
                            <h3 style={{ fontSize: '16px', marginBottom: '16px', zIndex: 1, position: 'relative' }}>Votre Pass d'Accès QR</h3>
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px', zIndex: 1, position: 'relative' }}>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LE231BackOfficeMemberToken12345" alt="QR Code" width="150" height="150" />
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', zIndex: 1, position: 'relative' }}>Scannez ce code à la borne d'entrée de votre salle.</p>
                        </div>

                        {/* Réservation Rapide */}
                        <div style={{ marginTop: '16px' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>Prochains Cours</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {schedule.map(c => {
                                    const isFull = c.booked >= c.capacity;
                                    return (
                                        <div key={c.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid var(--${c.type})` }}>
                                            <div>
                                                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{c.name}</h4>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                    <i className="ph ph-calendar"></i> {c.day} à {c.time} &nbsp;&nbsp;
                                                    <i className="ph ph-user"></i> Coach {c.coach}
                                                </p>
                                            </div>
                                            <button
                                                className="login-btn"
                                                onClick={() => handleBook(c.id)}
                                                disabled={c.isBookedByMe || (isFull && !c.isBookedByMe)}
                                                style={{
                                                    width: 'auto',
                                                    padding: '8px 16px',
                                                    fontSize: '13px',
                                                    background: c.isBookedByMe ? 'rgba(0,255,136,0.1)' : isFull ? 'rgba(255,255,255,0.05)' : '',
                                                    color: c.isBookedByMe ? 'var(--neon-green)' : isFull ? 'var(--text-muted)' : '#000',
                                                    border: c.isBookedByMe ? '1px solid var(--neon-green)' : isFull ? '1px solid var(--border-color)' : 'none',
                                                    boxShadow: isFull || c.isBookedByMe ? 'none' : '0 4px 12px rgba(0, 255, 136, 0.3)'
                                                }}
                                            >
                                                {c.isBookedByMe ? 'Inscrit(e)' : isFull ? 'Complet' : 'Réserver'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>)}

                {/* --- VUE PROGRAMMES --- */}
                {activeTab === 'programs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {myPrograms.length === 0 ? (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <i className="ph ph-barbell" style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px', display: 'block' }}></i>
                                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Aucun programme</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Votre coach ne vous a pas encore assigné de programme d'entraînement.</p>
                            </div>
                        ) : myPrograms.map(p => (
                            <div key={p.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(90deg, rgba(0,210,255,0.1) 0%, transparent 100%)' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--neon-blue)' }}>{p.name}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Niveau {p.level} • {p.duration}</span>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {p.schedule?.map((entry, index) => {
                                        const session = sessions.find(s => s.id === entry.sessionId);
                                        return (
                                            <div key={index} style={{ borderLeft: '2px solid var(--neon-green)', paddingLeft: '16px' }}>
                                                <h4 style={{ fontSize: '15px', marginBottom: '4px', color: '#fff' }}>{entry.day} : {session?.name}</h4>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{session?.exercises.length} exercices</p>

                                                <div style={{ display: 'grid', gap: '8px' }}>
                                                    {session?.exercises.map((ex, i) => {
                                                        const exoDetails = exercises.find(e => e.id === ex.exerciseId);
                                                        return (
                                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{exoDetails?.name}</span>
                                                                    <span style={{ fontSize: '14px', color: 'var(--neon-green)', fontWeight: 600 }}>{ex.sets} × {ex.reps}</span>
                                                                </div>
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                                                                    <span><i className="ph ph-weight"></i> {ex.load}</span>
                                                                    <span><i className="ph ph-clock"></i> Repos: {ex.rest}</span>
                                                                    <span><i className="ph ph-metronome"></i> Tempo: {ex.tempo}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <button className="login-btn" style={{ background: 'transparent', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', width: '100%', marginTop: '12px', fontSize: '13px', padding: '8px' }} onClick={() => showToast('Séance archivée dans votre historique !', 'success')}>
                                                    <i className="ph ph-check-circle"></i> Valider ma séance du jour
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
