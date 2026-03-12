import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings({ showToast }) {
    const [clubInfo, setClubInfo] = useLocalStorage('le231backoffice_clubInfo', {
        name: 'LE 231 BACK OFFICE',
        email: 'contact@le231.fr',
        phone: '+33 6 12 34 56 78',
        address: '14 Rue du Sport, 75001 Paris',
        siret: '123 456 789 00012',
        description: 'Salle de sport haut de gamme dédiée au bien-être et à la performance.',
    });

    const [notifications, setNotifications] = useLocalStorage('le231backoffice_notifications', {
        newMember: true,
        expiration: true,
        payment: true,
        report: false,
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        showToast('Paramètres sauvegardés avec succès !', 'success');
    };

    const toggleNotif = (key) =>
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <section className="settings-container p-8 pt-4">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">PARAMÈTRES</h1>
                <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-widest mt-1">Configurez les fondations de votre club</p>
            </header>

            <div className="settings-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Club Info */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-10 rounded-xl bg-[#10b981] flex items-center justify-center text-black">
                            <i className="ph ph-building text-xl"></i>
                        </div>
                        <h3 className="text-white font-black text-lg tracking-tight uppercase">Informations du Club</h3>
                    </div>

                    <div className="space-y-6">
                        {[
                            { key: 'name', label: 'Nom du Club', icon: 'ph-building', type: 'text' },
                            { key: 'email', label: 'Email de contact', icon: 'ph-envelope-simple', type: 'email' },
                            { key: 'phone', label: 'Téléphone', icon: 'ph-phone', type: 'tel' },
                            { key: 'address', label: 'Adresse', icon: 'ph-map-pin', type: 'text' },
                            { key: 'siret', label: 'SIRET', icon: 'ph-identification-card', type: 'text' },
                        ].map(({ key, label, icon, type }) => (
                            <div className="form-group" key={key}>
                                <label className="block text-[#94a3b8] text-[10px] font-black uppercase tracking-widest mb-2 ml-1">{label}</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-[#10b981] transition-colors">
                                        <i className={`ph ${icon} text-lg`}></i>
                                    </div>
                                    <input
                                        type={type}
                                        value={clubInfo[key]}
                                        onChange={(e) => setClubInfo({ ...clubInfo, [key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-[#475569] outline-none focus:border-[#10b981]/50 focus:bg-white/10 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="form-group">
                            <label className="block text-[#94a3b8] text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Description</label>
                            <textarea
                                value={clubInfo.description}
                                onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                                rows={3}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white placeholder:text-[#475569] outline-none focus:border-[#10b981]/50 focus:bg-white/10 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications & Security */}
                <div className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-10 rounded-xl bg-[#6366f1] flex items-center justify-center text-white">
                                <i className="ph ph-bell text-xl"></i>
                            </div>
                            <h3 className="text-white font-black text-lg tracking-tight uppercase">Notifications Automatisées</h3>
                        </div>

                        <div className="space-y-5">
                            {[
                                { key: 'newMember', label: 'Inscriptions', desc: 'Alerte à chaque nouvel utilisateur' },
                                { key: 'expiration', label: 'Expirations', desc: 'Rappel 3 jours avant la fin' },
                                { key: 'payment', label: 'Transactions', desc: 'Confirmation de chaque flux' },
                                { key: 'report', label: 'Analytiques', desc: 'Résumé hebdomadaire de performance' },
                            ].map(({ key, label, desc }) => (
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors" key={key}>
                                    <div>
                                        <h4 className="text-white text-sm font-black uppercase tracking-tight">{label}</h4>
                                        <p className="text-[#475569] text-[10px] font-bold uppercase tracking-widest">{desc}</p>
                                    </div>
                                    <button
                                        className={`w-12 h-6 rounded-full transition-all relative ${notifications[key] ? 'bg-[#10b981]' : 'bg-white/10'}`}
                                        onClick={() => toggleNotif(key)}
                                    >
                                        <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${notifications[key] ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="bg-red-500/5 backdrop-blur-3xl rounded-[32px] p-8 border border-red-500/10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <i className="ph ph-warning-octagon text-2xl text-red-500"></i>
                            <h3 className="text-red-500 font-black text-lg tracking-tight uppercase">Zone Critique</h3>
                        </div>
                        <p className="text-[#94a3b8] text-xs font-bold leading-relaxed mb-6">
                            La suppression des données est irréversible. Toute action entreprise ici impactera définitivement les comptes membres et les archives financières.
                        </p>
                        <button className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-3">
                            <i className="ph ph-trash text-lg"></i> Réinitialiser l'infrastructure
                        </button>
                    </div>
                </div>
            </div>

            {/* SAVE ACTION */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    className={`h-16 px-10 rounded-2xl bg-[#10b981] text-black font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            Synchronisation...
                        </>
                    ) : (
                        <>
                            <i className="ph ph-check-circle text-xl"></i>
                            Appliquer les changements
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
