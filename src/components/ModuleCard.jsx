import { useState } from 'react';

export default function ModuleCard({ module, onToggle }) {
    const { id, title, description, iconClass, category, active, theme } = module;

    return (
        <div className="glass-panel module-card">
            <div className="module-header">
                <div className={`mod-icon-wrapper ${theme}`}>
                    <i className={`ph ${iconClass}`}></i>
                </div>
            </div>

            <div className="module-info">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

            <div className="module-footer">
                <span className={`status-badge ${active ? 'active' : 'inactive'}`}>
                    <i className={`ph ${active ? 'ph-check-circle' : 'ph-x-circle'}`}></i>
                    {active ? 'Actif' : 'Inactif'}
                </span>

                <div
                    className={`toggle-switch ${active ? 'active' : ''}`}
                    onClick={() => onToggle(id)}
                    role="switch"
                    aria-checked={active}
                >
                    <div className="toggle-circle"></div>
                </div>
            </div>
        </div>
    );
}
