import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            setLoading(false);
            if (authError.message.includes('Invalid login credentials')) {
                setError('Email ou mot de passe incorrect.');
            } else {
                setError('Erreur de connexion : ' + authError.message);
            }
        }
        // Si succès, onAuthStatusChange de App.jsx prend le relais et masque cette page
    };

    return (
        <div className="login-page">
            {/* Background shapes */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>

            <div className="login-container">
                {/* Left panel — branding */}
                <div className="login-branding">
                    <div className="brand-logo">
                        <div className="logo-circle large">
                            <i className="ph ph-barbell"></i>
                        </div>
                        <h1>LE 231 BACK OFFICE</h1>
                    </div>
                    <p className="brand-tagline">
                        Pilotez votre salle de sport avec une précision professionnelle.
                    </p>

                    <div className="brand-features">
                        {[
                            { icon: 'ph-puzzle-piece', text: 'Gestion des Modules' },
                            { icon: 'ph-users', text: 'CRM Membres' },
                            { icon: 'ph-chart-line-up', text: 'Rapports & Analytics' },
                            { icon: 'ph-lock-key', text: 'Sécurité & Accès' },
                        ].map((f) => (
                            <div className="brand-feature-item" key={f.text}>
                                <i className={`ph ${f.icon}`}></i>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="login-form-panel glass-panel">
                    <div className="login-form-header">
                        <h2>Bon retour 👋</h2>
                        <p>Connectez-vous à votre espace administrateur.</p>
                    </div>

                    {/* Demo hint */}
                    <div className="demo-hint">
                        <i className="ph ph-info"></i>
                        <span>Démo : <strong>admin@clubconnect.fr</strong> / <strong>admin1234</strong></span>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Adresse Email</label>
                            <div className="input-wrapper">
                                <i className="ph ph-envelope-simple"></i>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <div className="input-wrapper">
                                <i className="ph ph-lock-simple"></i>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="input-icon-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" /> Se souvenir de moi
                            </label>
                            <a href="#" className="forgot-link">Mot de passe oublié ?</a>
                        </div>

                        {error && (
                            <div className="form-error">
                                <i className="ph ph-warning-circle"></i>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`login-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner"></span> Connexion en cours…</>
                            ) : (
                                <><i className="ph ph-sign-in"></i> Se connecter</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
