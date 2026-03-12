import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';

export default function Training({ showToast }) {
    const {
        sessions, addSession,
        programs, addProgram,
        exercises, members, assignProgramToMember
    } = useAppStore();

    const [activeSubTab, setActiveSubTab] = useState('sessions'); // 'sessions', 'programs', 'ai'
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create'

    // --- State pour le Builder de SÉANCES ---
    const [sessionForm, setSessionForm] = useState({ name: '', exercises: [] });
    const [newExo, setNewExo] = useState({ exerciseId: '', sets: 3, reps: '10', load: '10kg', rest: '60s', tempo: '2-0-2-0' });

    // --- State pour le Builder de PROGRAMMES ---
    const [programForm, setProgramForm] = useState({ name: '', level: 'Intermédiaire', duration: '4 semaines', schedule: [] });
    const [newPlanEntry, setNewPlanEntry] = useState({ day: 'Lundi', sessionId: '' });
    const [assignData, setAssignData] = useState({ programId: '', memberId: '' });

    // --- State pour l'IA ---
    const [aiQuery, setAiQuery] = useState({ objective: 'Prise de masse', level: 'Débutant', days: 3, assessment: '' });
    const [aiResult, setAiResult] = useState(null);

    // --- LOGIQUE SÉANCES ---
    const handleAddExoToSession = () => {
        if (!newExo.exerciseId) return;
        setSessionForm(prev => ({
            ...prev,
            exercises: [...prev.exercises, { ...newExo, exerciseId: parseInt(newExo.exerciseId) }]
        }));
        setNewExo({ exerciseId: '', sets: 3, reps: '10', load: '10kg', rest: '60s', tempo: '2-0-2-0' });
    };

    const handleSaveSession = () => {
        if (!sessionForm.name || sessionForm.exercises.length === 0) return;
        addSession({ id: Date.now(), ...sessionForm });
        showToast('Séance enregistrée !', 'success');
        setSessionForm({ name: '', exercises: [] });
        setViewMode('list');
    };

    // --- LOGIQUE PROGRAMMES ---
    const handleAddSessionToProgram = () => {
        if (!newPlanEntry.sessionId) return;
        setProgramForm(prev => ({
            ...prev,
            schedule: [...prev.schedule, { ...newPlanEntry, sessionId: parseInt(newPlanEntry.sessionId) }]
        }));
    };

    const handleSaveProgram = () => {
        if (!programForm.name || programForm.schedule.length === 0) return;
        addProgram({ id: Date.now(), ...programForm, assignedTo: [] });
        showToast('Programme créé !', 'success');
        setProgramForm({ name: '', level: 'Intermédiaire', duration: '4 semaines', schedule: [] });
        setViewMode('list');
    };

    const handleAssign = () => {
        if (!assignData.programId || !assignData.memberId) return;
        assignProgramToMember(parseInt(assignData.programId), parseInt(assignData.memberId));
        showToast('Programme assigné au membre.', 'success');
        setViewMode('list');
        setAssignData({ programId: '', memberId: '' });
    };

    // --- LOGIQUE IA ---
    const handleAiGenerate = () => {
        showToast('L\'IA analyse vos objectifs...', 'info');
        setTimeout(() => {
            setAiResult({
                title: `Programme ${aiQuery.objective} - ${aiQuery.level}`,
                explanation: `Basé sur votre objectif de ${aiQuery.objective}, nous recommandons une fréquence de ${aiQuery.days} jours avec focus sur les tempos lents pour maximiser le temps sous tension.`,
                suggestedSessions: [
                    { name: 'Push Focus', exercises: ['Développé Couché', 'Pompes'] },
                    { name: 'Pull Focus', exercises: ['Tirage Vertical', 'Rowing'] }
                ]
            });
        }, 1500);
    };

    return (
        <section className="dashboard-area">
            <div className="page-title-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h1>Espace Entraînement</h1>
                        <p>Séances techniques, programmes d'élite et intelligence artificielle.</p>
                    </div>
                </div>
            </div>

            {/* Menu Secondaire (Tabs) */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <button
                    onClick={() => { setActiveSubTab('sessions'); setViewMode('list'); }}
                    style={{ background: 'transparent', border: 'none', color: activeSubTab === 'sessions' ? 'var(--neon-blue)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
                >
                    <i className="ph ph-barbell"></i> Séances
                </button>
                <button
                    onClick={() => { setActiveSubTab('programs'); setViewMode('list'); }}
                    style={{ background: 'transparent', border: 'none', color: activeSubTab === 'programs' ? 'var(--neon-blue)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
                >
                    <i className="ph ph-calendar-check"></i> Programmes
                </button>
                <button
                    onClick={() => { setActiveSubTab('ai'); setAiResult(null); }}
                    style={{ background: 'transparent', border: 'none', color: activeSubTab === 'ai' ? 'var(--neon-green)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
                >
                    <i className="ph ph-sparkle"></i> Base de donnée IA
                </button>
            </div>

            {/* --- CONTENU SÉANCES --- */}
            {activeSubTab === 'sessions' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button className="add-member-btn" onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}>
                            <i className={`ph ${viewMode === 'list' ? 'ph-plus' : 'ph-arrow-left'}`}></i> {viewMode === 'list' ? 'Nouvelle Séance' : 'Retour à la liste'}
                        </button>
                    </div>

                    {viewMode === 'list' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {sessions.map(s => (
                                <div key={s.id} className="glass-panel" style={{ padding: '20px' }}>
                                    <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{s.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>{s.exercises.length} exercices techniques</p>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                        {s.exercises.map((ex, i) => (
                                            <div key={i} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>{exercises.find(e => e.id === ex.exerciseId)?.name}</span>
                                                <span style={{ color: 'var(--neon-blue)' }}>{ex.sets}x{ex.reps} @ {ex.load}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'create' && (
                        <div className="glass-panel" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                            <h3 style={{ marginBottom: '20px' }}>Constructeur de Séance</h3>
                            <div className="login-form">
                                <div className="form-group">
                                    <label>Nom de la séance</label>
                                    <div className="input-wrapper"><input placeholder="Ex: Upper Body Power" value={sessionForm.name} onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })} /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 100px 100px 40px', gap: '10px', alignItems: 'flex-end' }}>
                                    <div className="form-group"><label>Exercice</label><div className="input-wrapper"><select value={newExo.exerciseId} onChange={e => setNewExo({ ...newExo, exerciseId: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%' }}>
                                        <option value="" style={{ background: '#1a1f2e' }}>Choisir...</option>
                                        {exercises.map(ex => <option key={ex.id} value={ex.id} style={{ background: '#1a1f2e' }}>{ex.name}</option>)}
                                    </select></div></div>
                                    <div className="form-group"><label>Séries</label><div className="input-wrapper"><input type="number" value={newExo.sets} onChange={e => setNewExo({ ...newExo, sets: e.target.value })} /></div></div>
                                    <div className="form-group"><label>Reps</label><div className="input-wrapper"><input value={newExo.reps} onChange={e => setNewExo({ ...newExo, reps: e.target.value })} /></div></div>
                                    <div className="form-group"><label>Charge</label><div className="input-wrapper"><input value={newExo.load} onChange={e => setNewExo({ ...newExo, load: e.target.value })} /></div></div>
                                    <div className="form-group"><label>Repos</label><div className="input-wrapper"><input value={newExo.rest} onChange={e => setNewExo({ ...newExo, rest: e.target.value })} /></div></div>
                                    <div className="form-group"><label>Tempo</label><div className="input-wrapper"><input value={newExo.tempo} onChange={e => setNewExo({ ...newExo, tempo: e.target.value })} /></div></div>
                                    <button className="action-btn" style={{ height: '40px', background: 'var(--neon-blue)', color: '#000' }} onClick={handleAddExoToSession}><i className="ph ph-plus"></i></button>
                                </div>

                                {sessionForm.exercises.length > 0 && (
                                    <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px' }}>
                                        {sessionForm.exercises.map((ex, i) => (
                                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <strong>{exercises.find(e => e.id === ex.exerciseId)?.name}</strong>
                                                <span>{ex.sets} sets x {ex.reps}</span>
                                                <span style={{ color: 'var(--neon-green)' }}>{ex.load}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tempo: {ex.tempo}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button className="login-btn" style={{ marginTop: '24px' }} onClick={handleSaveSession}>Enregistrer la Séance</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- CONTENU PROGRAMMES --- */}
            {activeSubTab === 'programs' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
                        <button className="add-member-btn" onClick={() => setViewMode('assign')} style={{ background: 'rgba(0,210,255,0.1)', color: 'var(--neon-blue)', border: '1px solid currentColor' }}>
                            <i className="ph ph-user-plus"></i> Assigner
                        </button>
                        <button className="add-member-btn" onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}>
                            <i className={`ph ${viewMode === 'list' ? 'ph-plus' : 'ph-arrow-left'}`}></i> {viewMode === 'list' ? 'Nouveau Programme' : 'Retour'}
                        </button>
                    </div>

                    {viewMode === 'list' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {programs.map(p => (
                                <div key={p.id} className="glass-panel" style={{ padding: '20px' }}>
                                    <h3 style={{ marginBottom: '8px' }}>{p.name}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{p.level} • {p.duration}</p>
                                    <div style={{ paddingLeft: '12px', borderLeft: '2px solid var(--neon-blue)' }}>
                                        {p.schedule?.map((entry, idx) => (
                                            <div key={idx} style={{ fontSize: '13px', marginBottom: '4px' }}>
                                                <strong>{entry.day}:</strong> {sessions.find(s => s.id === entry.sessionId)?.name || 'Séance inconnue'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'create' && (
                        <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                            <h3>Constructeur de Programme</h3>
                            <div className="login-form">
                                <div className="form-group"><label>Nom du programme</label><div className="input-wrapper"><input value={programForm.name} onChange={e => setProgramForm({ ...programForm, name: e.target.value })} /></div></div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div className="form-group" style={{ flex: 1 }}><label>Jour</label><div className="input-wrapper"><select value={newPlanEntry.day} onChange={e => setNewPlanEntry({ ...newPlanEntry, day: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%' }}>
                                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => <option key={d} style={{ background: '#1a1f2e' }}>{d}</option>)}
                                    </select></div></div>
                                    <div className="form-group" style={{ flex: 2 }}><label>Séance</label><div className="input-wrapper"><select value={newPlanEntry.sessionId} onChange={e => setNewPlanEntry({ ...newPlanEntry, sessionId: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%' }}>
                                        <option value="" style={{ background: '#1a1f2e' }}>Choisir une séance...</option>
                                        {sessions.map(s => <option key={s.id} value={s.id} style={{ background: '#1a1f2e' }}>{s.name}</option>)}
                                    </select></div></div>
                                    <button className="action-btn" style={{ height: '40px', marginTop: '28px' }} onClick={handleAddSessionToProgram}><i className="ph ph-plus"></i></button>
                                </div>

                                {programForm.schedule.map((s, i) => (
                                    <div key={i} style={{ fontSize: '14px', marginBottom: '8px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                        {s.day} : {sessions.find(x => x.id === s.sessionId)?.name}
                                    </div>
                                ))}

                                <button className="login-btn" style={{ marginTop: '20px' }} onClick={handleSaveProgram}>Initialiser le Programme</button>
                            </div>
                        </div>
                    )}
                    {viewMode === 'assign' && (
                        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '32px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Assigner un programme</h3>
                            <div className="login-form">
                                <div className="form-group">
                                    <label>Membre cible</label>
                                    <div className="input-wrapper">
                                        <i className="ph ph-user"></i>
                                        <select value={assignData.memberId} onChange={e => setAssignData({ ...assignData, memberId: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}>
                                            <option value="" style={{ background: '#1a1f2e' }}>Choisir un membre...</option>
                                            {members.filter(m => m.status === 'actif').map(m => (
                                                <option key={m.id} value={m.id} style={{ background: '#1a1f2e' }}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Programme à assigner</label>
                                    <div className="input-wrapper">
                                        <i className="ph ph-clipboard-text"></i>
                                        <select value={assignData.programId} onChange={e => setAssignData({ ...assignData, programId: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}>
                                            <option value="" style={{ background: '#1a1f2e' }}>Choisir un programme...</option>
                                            {programs.map(p => (
                                                <option key={p.id} value={p.id} style={{ background: '#1a1f2e' }}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button className="login-btn" onClick={handleAssign} style={{ marginTop: '16px' }} disabled={!assignData.programId || !assignData.memberId}>
                                    Confirmer l'assignation
                                </button>
                                <button className="login-btn" onClick={() => setViewMode('list')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline' }}>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- CONTENU IA --- */}
            {activeSubTab === 'ai' && (
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '20px' }}><i className="ph ph-sparkle"></i> IA Programmer</h3>
                        <div className="login-form">
                            <div className="form-group"><label>Objectif Principal</label><div className="input-wrapper"><select style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%' }} value={aiQuery.objective} onChange={e => setAiQuery({ ...aiQuery, objective: e.target.value })}><option style={{ background: '#1a1f2e' }}>Prise de masse</option><option style={{ background: '#1a1f2e' }}>Perte de gras</option><option style={{ background: '#1a1f2e' }}>Explosivité</option></select></div></div>
                            <div className="form-group"><label>Niveau Actuel</label><div className="input-wrapper"><select style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%' }} value={aiQuery.level} onChange={e => setAiQuery({ ...aiQuery, level: e.target.value })}><option style={{ background: '#1a1f2e' }}>Débutant</option><option style={{ background: '#1a1f2e' }}>Intermédiaire</option><option style={{ background: '#1a1f2e' }}>Avancé</option></select></div></div>
                            <div className="form-group"><label>Disponibilité (jours/semaine)</label><div className="input-wrapper"><input type="number" value={aiQuery.days} onChange={e => setAiQuery({ ...aiQuery, days: e.target.value })} /></div></div>
                            <div className="form-group"><label>Assessment (Bilan / Blessures / Matériel)</label><div className="input-wrapper"><textarea style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '8px', minHeight: '80px', outline: 'none' }} placeholder="Ex: Douleurs aux genoux, accès complet salle, focus bras..." value={aiQuery.assessment} onChange={e => setAiQuery({ ...aiQuery, assessment: e.target.value })} /></div></div>
                            <button className="login-btn" onClick={handleAiGenerate} style={{ background: 'var(--neon-green)', color: '#000', fontWeight: 700 }}>Générer par IA</button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: aiResult ? 'flex-start' : 'center', minHeight: '400px' }}>
                        {!aiResult ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <i className="ph ph-brain" style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}></i>
                                <p>Configurez les paramètres et lancez la génération.</p>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{ color: 'var(--neon-green)', marginBottom: '12px' }}>{aiResult.title}</h2>
                                <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>{aiResult.explanation}</p>
                                <h4 style={{ marginBottom: '16px' }}>Structure Suggérée :</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {aiResult.suggestedSessions.map((s, i) => (
                                        <div key={i} className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px' }}>
                                            <strong style={{ display: 'block', marginBottom: '8px' }}>{s.name}</strong>
                                            <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px' }}>
                                                {s.exercises.map((ex, j) => <li key={j}>{ex}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <button className="add-member-btn" style={{ marginTop: '32px' }} onClick={() => showToast('Programme exporté vers le module Programmes', 'success')}>Convertir en Programme Actif</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
