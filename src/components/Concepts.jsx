import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Concepts({ showToast }) {
    const [activeTab, setActiveTab] = useState('concepts');
    const [concepts, setConcepts] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [editingConcept, setEditingConcept] = useState(null);
    const [editingCoach, setEditingCoach] = useState(null);
    const [showingAvailabilities, setShowingAvailabilities] = useState(null); // Coach object
    const [availabilities, setAvailabilities] = useState([]);

    const DAYS_LIST = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const HOURS_LIST = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: conceptsData } = await supabase.from('course_concepts').select('*').order('name');
            const { data: coachesData } = await supabase.from('coaches').select('*').order('name');

            setConcepts(conceptsData || []);
            setCoaches(coachesData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
        setLoading(false);
    };

    const handleSaveConcept = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const conceptData = {
            name: formData.get('name'),
            description: formData.get('description'),
            type: formData.get('type'),
            duration: parseInt(formData.get('duration')),
            intensity: parseInt(formData.get('intensity')),
            capacity: parseInt(formData.get('capacity')),
            allowed_sales_types: formData.getAll('allowed_sales_types') // multiple checkbox support
        };

        try {
            if (editingConcept?.id) {
                const { error } = await supabase.from('course_concepts').update(conceptData).eq('id', editingConcept.id);
                if (error) throw error;
                showToast('Concept mis à jour', 'success');
            } else {
                const { error } = await supabase.from('course_concepts').insert([conceptData]);
                if (error) throw error;
                showToast('Concept créé', 'success');
            }
            setEditingConcept(null);
            fetchData();
        } catch (error) {
            showToast('Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleSaveCoach = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const coachData = {
            name: formData.get('name'),
            bio: formData.get('bio'),
            specialties: formData.get('specialties'),
            avatar_url: formData.get('avatar_url')
        };

        try {
            if (editingCoach?.id) {
                const { error } = await supabase.from('coaches').update(coachData).eq('id', editingCoach.id);
                if (error) throw error;
                showToast('Coach mis à jour', 'success');
            } else {
                const { error } = await supabase.from('coaches').insert([coachData]);
                if (error) throw error;
                showToast('Coach créé', 'success');
            }
            setEditingCoach(null);
            fetchData();
        } catch (error) {
            showToast('Erreur lors de l\'enregistrement', 'error');
        }
    };

    const fetchAvailabilities = async (coachId) => {
        const { data } = await supabase.from('coach_availabilities').select('*').eq('coach_id', coachId);
        setAvailabilities(data || []);
    };

    const handleToggleAvailability = async (day, hour) => {
        const existing = availabilities.find(a => a.day === day && a.start_time === hour);
        if (existing) {
            await supabase.from('coach_availabilities').delete().eq('id', existing.id);
            setAvailabilities(prev => prev.filter(a => a.id !== existing.id));
        } else {
            const { data } = await supabase.from('coach_availabilities').insert([{
                coach_id: showingAvailabilities.id,
                day,
                start_time: hour,
                end_time: (parseInt(hour.split(':')[0]) + 1) + ':00'
            }]).select();
            setAvailabilities(prev => [...prev, data[0]]);
        }
    };

    if (loading) return <div className="p-8 text-center"><i className="ph ph-spinner-gap animate-spin text-4xl"></i></div>;

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-left">
                    <h1><i className="ph ph-lightbulb"></i> Concepts & Coachs</h1>
                    <p className="subtitle">Gérez vos programmes et votre équipe technique</p>
                </div>
                <div className="header-actions">
                    <div className="tab-switcher">
                        <button
                            className={`tab-btn ${activeTab === 'concepts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('concepts')}
                        >
                            Concepts de Cours
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'coaches' ? 'active' : ''}`}
                            onClick={() => setActiveTab('coaches')}
                        >
                            L'Équipe Coachs
                        </button>
                    </div>
                </div>
            </header>

            <div className="content-area">
                {activeTab === 'concepts' ? (
                    <div className="concepts-grid">
                        <div className="data-table-card">
                            <div className="card-header">
                                <h3>Liste des Concepts</h3>
                                <button className="btn-primary btn-sm" onClick={() => setEditingConcept({})}>
                                    <i className="ph ph-plus"></i> Nouveau Concept
                                </button>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Type</th>
                                        <th>Durée</th>
                                        <th>Intensité</th>
                                        <th>Capacité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {concepts.map(c => (
                                        <tr key={c.id}>
                                            <td className="font-bold">{c.name}</td>
                                            <td>
                                                <span className={`badge ${c.type === 'small_group' ? 'badge-blue' : 'badge-orange'}`}>
                                                    {c.type === 'small_group' ? 'Small Group' : 'Personal Training'}
                                                </span>
                                            </td>
                                            <td>{c.duration} min</td>
                                            <td>
                                                <div className="intensity-dots">
                                                    {[1, 2, 3, 4, 5].map(lvl => (
                                                        <span key={lvl} className={`dot ${lvl <= (c.intensity || 3) ? 'active' : ''}`}></span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="font-bold">{c.capacity || 15}</td>
                                            <td>
                                                <button className="action-btn" onClick={() => setEditingConcept(c)}><i className="ph ph-pencil"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {editingConcept && (
                            <div className="side-form-card">
                                <h3>{editingConcept.id ? 'Modifier le Concept' : 'Nouveau Concept'}</h3>
                                <form onSubmit={handleSaveConcept} className="standard-form">
                                    <div className="form-group">
                                        <label>Nom du Cours</label>
                                        <input name="name" defaultValue={editingConcept.name} required placeholder="ex: CrossFit WOD" />
                                    </div>
                                    <div className="form-group">
                                        <label>Description (Affiche dans l'app client)</label>
                                        <textarea name="description" defaultValue={editingConcept.description} rows="4" placeholder="Objectifs et contenu de la séance..." />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Type</label>
                                            <select name="type" defaultValue={editingConcept.type || 'small_group'}>
                                                <option value="small_group">Small Group</option>
                                                <option value="personal">Personal Training</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Durée (min)</label>
                                            <input name="duration" type="number" defaultValue={editingConcept.duration || 60} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Intensité (1-5)</label>
                                            <div className="intensity-selector">
                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                    <label key={lvl} className="intensity-lvl">
                                                        <input
                                                            type="radio"
                                                            name="intensity"
                                                            value={lvl}
                                                            defaultChecked={(editingConcept.intensity || 3) === lvl}
                                                        />
                                                        <span>{lvl}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Capacité Max</label>
                                            <input name="capacity" type="number" defaultValue={editingConcept.capacity || 15} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Types d'accès autorisés</label>
                                        <div className="access-types-grid">
                                            {[
                                                { key: 'abonnements', label: 'Abonnements' },
                                                { key: 'ticketsCoaching', label: 'Tickets Coaching' },
                                                { key: 'ticketsSmallGroup', label: 'Tickets Small Group' }
                                            ].map(cat => (
                                                <label key={cat.key} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="allowed_sales_types"
                                                        value={cat.key}
                                                        defaultChecked={editingConcept.allowed_sales_types?.includes(cat.key)}
                                                    />
                                                    <span className="custom-checkbox"></span>
                                                    <span>{cat.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn-outline" onClick={() => setEditingConcept(null)}>Annuler</button>
                                        <button type="submit" className="btn-primary">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="coaches-grid">
                        <div className="data-table-card">
                            <div className="card-header">
                                <h3>Nos Coachs</h3>
                                <button className="btn-primary btn-sm" onClick={() => setEditingCoach({})}>
                                    <i className="ph ph-user-plus"></i> Ajouter un Coach
                                </button>
                            </div>
                            <div className="coaches-list">
                                {coaches.map(coach => (
                                    <div key={coach.id} className="coach-item-row">
                                        <div className="coach-avatar-circle">
                                            {coach.avatar_url ? <img src={coach.avatar_url} /> : coach.name.charAt(0)}
                                        </div>
                                        <div className="coach-info">
                                            <p className="coach-name">{coach.name}</p>
                                            <p className="coach-specs">{coach.specialties}</p>
                                        </div>
                                        <div className="coach-actions">
                                            <button className="action-btn" onClick={() => setEditingCoach(coach)}><i className="ph ph-pencil"></i> Profile</button>
                                            <button className="action-btn btn-secondary" onClick={() => { setShowingAvailabilities(coach); fetchAvailabilities(coach.id); }}>
                                                <i className="ph ph-calendar"></i> Dispos
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {editingCoach && (
                            <div className="side-form-card">
                                <h3>{editingCoach.id ? 'Profil de ' + editingCoach.name : 'Nouveau Coach'}</h3>
                                <form onSubmit={handleSaveCoach} className="standard-form">
                                    <div className="form-group">
                                        <label>Nom Complet</label>
                                        <input name="name" defaultValue={editingCoach.name} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Spécialités (Séparez par des virgules)</label>
                                        <input name="specialties" defaultValue={editingCoach.specialties} placeholder="Yoga, CrossFit, Boxe..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Biographie</label>
                                        <textarea name="bio" defaultValue={editingCoach.bio} rows="3" />
                                    </div>
                                    <div className="form-group">
                                        <label>URL Avatar</label>
                                        <input name="avatar_url" defaultValue={editingCoach.avatar_url} placeholder="https://..." />
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn-outline" onClick={() => setEditingCoach(null)}>Annuler</button>
                                        <button type="submit" className="btn-primary">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showingAvailabilities && (
                <div className="availability-modal-overlay" onClick={() => setShowingAvailabilities(null)}>
                    <div className="availability-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Disponibilités : {showingAvailabilities.name}</h3>
                            <button className="close-btn" onClick={() => setShowingAvailabilities(null)}><i className="ph ph-x"></i></button>
                        </div>
                        <p className="modal-hint">Cliquez sur les créneaux pour les activer/désactiver (Mode Hebdo)</p>
                        <div className="availability-grid-container">
                            <table className="availability-table">
                                <thead>
                                    <tr>
                                        <th>Heure</th>
                                        {DAYS_LIST.map(d => <th key={d}>{d.substring(0, 3)}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {HOURS_LIST.map(h => (
                                        <tr key={h}>
                                            <td className="time-col">{h}</td>
                                            {DAYS_LIST.map(d => {
                                                const isActive = availabilities.some(a => a.day === d && a.start_time === h);
                                                return (
                                                    <td key={d}
                                                        className={`slot-cell ${isActive ? 'active' : ''}`}
                                                        onClick={() => handleToggleAvailability(d, h)}
                                                    ></td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary" onClick={() => setShowingAvailabilities(null)}>Terminer</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .concepts-grid, .coaches-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 24px;
                    align-items: start;
                }
                @media (max-width: 1000px) {
                    .concepts-grid, .coaches-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .data-table-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 24px;
                }
                .side-form-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 24px;
                    position: sticky;
                    top: 24px;
                }
                .tab-switcher {
                    display: flex;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 4px;
                    border-radius: 50px;
                    border: 1px solid var(--border-color);
                }
                .tab-btn {
                    padding: 8px 20px;
                    border: none;
                    background: none;
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 50px;
                    font-size: 14px;
                    transition: var(--transition-fast);
                }
                .tab-btn:hover {
                    color: var(--text-primary);
                }
                .tab-btn.active {
                    background: var(--text-primary);
                    color: #000;
                }
                .coach-item-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 0;
                    border-bottom: 1px solid var(--border-color);
                }
                .coach-item-row:last-child { border-bottom: none; }
                .coach-avatar-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    overflow: hidden;
                    border: 2px solid var(--neon-blue);
                }
                .coach-info { flex: 1; }
                .coach-name { font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
                .coach-specs { font-size: 12px; color: var(--text-secondary); }
                .badge {
                    padding: 4px 10px;
                    border-radius: 50px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .badge-blue { background: rgba(0, 210, 255, 0.1); color: var(--neon-blue); border: 1px solid rgba(0, 210, 255, 0.2); }
                .badge-orange { background: rgba(255, 94, 0, 0.1); color: var(--neon-orange); border: 1px solid rgba(255, 94, 0, 0.2); }

                .availability-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .availability-modal {
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 32px;
                }
                .availability-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 24px;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                }
                .availability-table th, .availability-table td {
                    border: 1px solid var(--border-color);
                    text-align: center;
                    padding: 12px;
                }
                .availability-table th {
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-secondary);
                    font-size: 12px;
                    text-transform: uppercase;
                }
                .time-col { background: rgba(255, 255, 255, 0.05); font-size: 12px; font-weight: 600; color: var(--text-primary); }
                .slot-cell { cursor: pointer; height: 40px; transition: all 0.2s; }
                .slot-cell:hover { background: rgba(0, 210, 255, 0.1); }
                .slot-cell.active { 
                    background: var(--neon-blue); 
                    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
                }
                .modal-hint { font-size: 13px; color: var(--text-secondary); margin-top: 12px; opacity: 0.8; }
                .availability-grid-container { overflow-x: auto; }

                .intensity-selector {
                    display: flex;
                    gap: 8px;
                    margin-top: 6px;
                }
                .intensity-lvl {
                    flex: 1;
                    cursor: pointer;
                }
                .intensity-lvl input { display: none; }
                .intensity-lvl span {
                    display: block;
                    text-align: center;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                }
                .intensity-lvl:hover span {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                }
                .intensity-lvl input:checked + span {
                    background: var(--neon-blue);
                    color: #000;
                    border-color: var(--neon-blue);
                    box-shadow: 0 0 15px var(--neon-blue-glow);
                }

                .access-types-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                    margin-top: 10px;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    font-size: 14px;
                    color: var(--text-secondary);
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-sm);
                    transition: var(--transition-fast);
                }
                .checkbox-label:hover {
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--text-primary);
                }
                .checkbox-label input { display: none; }
                .custom-checkbox {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--border-color);
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .checkbox-label input:checked + .custom-checkbox {
                    background: var(--neon-green);
                    border-color: var(--neon-green);
                    box-shadow: 0 0 10px var(--neon-green-glow);
                }
                .checkbox-label input:checked + .custom-checkbox::after {
                    content: '✓';
                    color: #000;
                    font-size: 14px;
                    font-weight: 900;
                }

                .intensity-dots {
                    display: flex;
                    gap: 4px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                }
                .dot.active {
                    background: var(--neon-blue);
                    box-shadow: 0 0 8px var(--neon-blue);
                }
            `}</style>
        </div>
    );
}
