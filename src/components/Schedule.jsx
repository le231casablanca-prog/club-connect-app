import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

export default function Schedule({ showToast }) {
    const [classes, setClasses] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [concepts, setConcepts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scheduleType, setScheduleType] = useState('small_group'); // small_group or personal_training

    const [form, setForm] = useState({
        name: '',
        day: 'Lundi',
        time: '08:00',
        coach_id: '',
        concept_id: '',
        capacity: 15,
        type: 'small_group'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: classesData } = await supabase.from('classes').select('*');
            const { data: coachesData } = await supabase.from('coaches').select('*');
            const { data: conceptsData } = await supabase.from('course_concepts').select('*');

            setClasses(classesData || []);
            setCoaches(coachesData || []);
            setConcepts(conceptsData || []);
        } catch (error) {
            console.error('Error:', error);
            showToast('Erreur de chargement des données', 'error');
        }
        setLoading(false);
    };

    const handleAddClass = async () => {
        if (!form.name || !form.coach_id) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        const coach = coaches.find(c => c.id === parseInt(form.coach_id));
        const concept = concepts.find(c => c.id === parseInt(form.concept_id));

        const classData = {
            name: form.name,
            day: form.day,
            time: form.time,
            coach: coach?.name || 'Inconnu',
            coach_id: parseInt(form.coach_id),
            concept_id: form.concept_id ? parseInt(form.concept_id) : null,
            capacity: form.capacity,
            intensity: concept?.intensity || 3,
            type: form.type,
            booked: 0
        };

        try {
            const { data, error } = await supabase.from('classes').insert([classData]).select();
            if (error) throw error;

            setClasses(prev => [...prev, data[0]]);
            setShowModal(false);
            setForm({ name: '', day: 'Lundi', time: '08:00', coach_id: '', concept_id: '', capacity: 15, type: scheduleType });
            showToast('Cours ajouté au planning !', 'success');
        } catch (error) {
            showToast('Erreur lors de l\'ajout', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('classes').delete().eq('id', id);
            if (error) throw error;
            setClasses(prev => prev.filter(c => c.id !== id));
            showToast('Cours supprimé.', 'info');
        } catch (error) {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const filteredClasses = classes.filter(c => c.type === scheduleType);

    return (
        <section className="dashboard-area">
            <div className="page-title-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Planning & Réservations</h1>
                    <p>Gérez l'emploi du temps de votre salle et assignez les coachs.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="tab-switcher" style={{ marginBottom: 0 }}>
                        <button
                            className={`tab-btn ${scheduleType === 'small_group' ? 'active' : ''}`}
                            onClick={() => { setScheduleType('small_group'); setForm(f => ({ ...f, type: 'small_group' })); }}
                        >
                            Small Group
                        </button>
                        <button
                            className={`tab-btn ${scheduleType === 'personal_training' ? 'active' : ''}`}
                            onClick={() => { setScheduleType('personal_training'); setForm(f => ({ ...f, type: 'personal_training' })); }}
                        >
                            Personal Training
                        </button>
                    </div>
                    <button className="add-member-btn" onClick={() => setShowModal(true)}>
                        <i className="ph ph-calendar-plus"></i> Nouveau Créneau
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px', textAlign: 'center' }}><i className="ph ph-clock"></i></th>
                            {DAYS.map(day => <th key={day}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {HOURS.map(hour => (
                            <tr key={hour}>
                                <td className="time-cell">{hour}</td>
                                {DAYS.map(day => {
                                    const classItem = filteredClasses.find(c => c.day === day && c.time === hour);
                                    return (
                                        <td key={`${day}-${hour}`} className="schedule-cell">
                                            {classItem && (
                                                <div className={`class-card ${classItem.type === 'personal_training' ? 'border-neon-orange' : 'border-neon-blue'}`}>
                                                    <div className="class-header">
                                                        <strong>{classItem.name}</strong>
                                                        <button className="del-btn" onClick={() => handleDelete(classItem.id)}>
                                                            <i className="ph ph-x"></i>
                                                        </button>
                                                    </div>
                                                    <div className="class-info">
                                                        <span className="coach-tag"><i className="ph ph-user"></i> {classItem.coach}</span>
                                                        <span className={`capacity-tag ${classItem.booked >= classItem.capacity ? 'full' : ''}`}>
                                                            {classItem.booked}/{classItem.capacity} places
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal glass-panel" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Nouveau Créneau ({scheduleType === 'small_group' ? 'Small Group' : 'PT'})</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><i className="ph ph-x"></i></button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Concept de Cours</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-barbell"></i>
                                    <select
                                        value={form.concept_id}
                                        onChange={e => {
                                            const concept = concepts.find(c => c.id === parseInt(e.target.value));
                                            setForm({
                                                ...form,
                                                concept_id: e.target.value,
                                                name: concept?.name || '',
                                                capacity: concept?.capacity || 15
                                            });
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a1f2e' }}>Choisir un concept...</option>
                                        {concepts.filter(c => c.type === (scheduleType === 'personal_training' ? 'personal' : 'small_group')).map(c => (
                                            <option key={c.id} value={c.id} style={{ background: '#1a1f2e' }}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nom d'affichage (si différent)</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-pencil"></i>
                                    <input placeholder="Ex: Yoga Vinyasa" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Jour</label>
                                    <div className="input-wrapper">
                                        <i className="ph ph-calendar"></i>
                                        <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                                            {DAYS.map(d => <option key={d} value={d} style={{ background: '#1a1f2e' }}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Heure</label>
                                    <div className="input-wrapper">
                                        <i className="ph ph-clock"></i>
                                        <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                                            {HOURS.map(h => <option key={h} value={h} style={{ background: '#1a1f2e' }}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Coach Responsable</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-user"></i>
                                    <select
                                        value={form.coach_id}
                                        onChange={e => setForm({ ...form, coach_id: e.target.value })}
                                    >
                                        <option value="" style={{ background: '#1a1f2e' }}>Choisir un coach...</option>
                                        {coaches.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1f2e' }}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Capacité (Places)</label>
                                <div className="input-wrapper">
                                    <i className="ph ph-users"></i>
                                    <input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} />
                                </div>
                            </div>

                            <button className="submit-btn" onClick={handleAddClass}>
                                <i className="ph ph-check"></i> Publier le créneau
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .tab-switcher {
                    display: flex;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 4px;
                    border-radius: 50px;
                    border: 1px solid var(--border-color);
                    margin-bottom: 20px;
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

                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 8px 0;
                }

                .input-wrapper select {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--text-primary);
                    font-size: 14px;
                    cursor: pointer;
                    padding-right: 25px;
                }

                .input-wrapper select option {
                    background: #1a1f2e;
                    color: #fff;
                }

                .submit-btn {
                    background: var(--neon-blue);
                    color: #000;
                    padding: 14px;
                    border-radius: var(--radius-md);
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 0 15px var(--neon-blue-glow);
                    margin-top: 10px;
                }
                .submit-btn:hover {
                    box-shadow: 0 0 25px var(--neon-blue-glow);
                    transform: translateY(-2px);
                }
                .submit-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </section>
    );
}
