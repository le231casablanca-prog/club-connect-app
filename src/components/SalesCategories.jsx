import { useState, useEffect } from 'react';

const DEFAULT_PRODUCTS = {
    abonnements: [
        { id: 'abo-annuel', name: 'Annuel', duration: '12 mois', price: 599 },
        { id: 'abo-semestriel', name: 'Semestriel', duration: '6 mois', price: 349 },
        { id: 'abo-trimestriel', name: 'Trimestriel', duration: '3 mois', price: 199 },
    ],
    ticketsCoaching: [
        { id: 'tc-50', name: '50 Tickets', duration: '12 mois', price: 1500 },
        { id: 'tc-24', name: '24 Tickets', duration: '6 mois', price: 840 },
        { id: 'tc-12', name: '12 Tickets', duration: '3 mois', price: 480 },
    ],
    ticketsSmallGroup: [
        { id: 'tsg-50', name: '50 Tickets', duration: '12 mois', price: 750 },
        { id: 'tsg-30', name: '30 Tickets', duration: '6 mois', price: 510 },
        { id: 'tsg-20', name: '20 Tickets', duration: '3 mois', price: 380 },
        { id: 'tsg-10', name: '10 Tickets', duration: '1 mois', price: 200 },
    ],
};

const STORAGE_KEY = 'le231backoffice_salesProducts';

const CATEGORIES = [
    { key: 'abonnements', label: 'Abonnements', icon: 'ph-credit-card', color: '#00ff88' },
    { key: 'ticketsCoaching', label: 'Tickets Coaching', icon: 'ph-user-focus', color: '#00d2ff' },
    { key: 'ticketsSmallGroup', label: 'Tickets Small Group / Accès', icon: 'ph-users-three', color: '#ff8a00' },
];

export default function SalesCategories({ showToast }) {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    });
    const [activeCategory, setActiveCategory] = useState('abonnements');
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ price: '', duration: '' });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }, [products]);

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditValues({ price: product.price, duration: product.duration });
    };

    const handleSave = (categoryKey, productId) => {
        setProducts(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey].map(p =>
                p.id === productId
                    ? { ...p, price: Number(editValues.price), duration: editValues.duration }
                    : p
            )
        }));
        setEditingId(null);
        showToast?.('Produit mis à jour !', 'success');
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValues({ price: '', duration: '' });
    };

    const activeInfo = CATEGORIES.find(c => c.key === activeCategory);
    const currentProducts = products[activeCategory] || [];

    // Compute totals
    const totalProducts = Object.values(products).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="sales-page">
            {/* Page header */}
            <div className="sales-header">
                <div>
                    <h1><i className="ph ph-storefront"></i> Catégories de Vente</h1>
                    <p className="sales-subtitle">{totalProducts} produits configurés</p>
                </div>
            </div>

            {/* Category tabs */}
            <div className="sales-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        className={`sales-tab ${activeCategory === cat.key ? 'active' : ''}`}
                        onClick={() => { setActiveCategory(cat.key); setEditingId(null); }}
                        style={activeCategory === cat.key ? { borderColor: cat.color, color: cat.color } : {}}
                    >
                        <i className={`ph ${cat.icon}`}></i>
                        <span>{cat.label}</span>
                        <span className="tab-count">{products[cat.key]?.length || 0}</span>
                    </button>
                ))}
            </div>

            {/* Category header card */}
            <div className="sales-category-header" style={{ borderLeftColor: activeInfo.color }}>
                <div className="cat-icon" style={{ background: `${activeInfo.color}20`, color: activeInfo.color }}>
                    <i className={`ph ${activeInfo.icon}`} style={{ fontSize: '28px' }}></i>
                </div>
                <div>
                    <h2>{activeInfo.label}</h2>
                    <p>{currentProducts.length} offre{currentProducts.length > 1 ? 's' : ''} disponible{currentProducts.length > 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Products grid */}
            <div className="sales-products-grid">
                {currentProducts.map((product) => {
                    const isEditing = editingId === product.id;

                    return (
                        <div key={product.id} className={`sales-product-card ${isEditing ? 'editing' : ''}`}>
                            <div className="product-top">
                                <div className="product-badge" style={{ background: `${activeInfo.color}15`, color: activeInfo.color }}>
                                    <i className={`ph ${activeInfo.icon}`}></i>
                                </div>
                                <h3 className="product-name">{product.name}</h3>
                            </div>

                            {isEditing ? (
                                <div className="product-edit-form">
                                    <div className="edit-field">
                                        <label>Tarif (€)</label>
                                        <div className="edit-input-wrap">
                                            <input
                                                type="number"
                                                value={editValues.price}
                                                onChange={(e) => setEditValues(v => ({ ...v, price: e.target.value }))}
                                                min="0"
                                                autoFocus
                                            />
                                            <span className="input-suffix">€</span>
                                        </div>
                                    </div>
                                    <div className="edit-field">
                                        <label>Durée</label>
                                        <input
                                            type="text"
                                            value={editValues.duration}
                                            onChange={(e) => setEditValues(v => ({ ...v, duration: e.target.value }))}
                                            placeholder="ex: 12 mois"
                                        />
                                    </div>
                                    <div className="edit-actions">
                                        <button className="btn-save" onClick={() => handleSave(activeCategory, product.id)}>
                                            <i className="ph ph-check"></i> Enregistrer
                                        </button>
                                        <button className="btn-cancel" onClick={handleCancel}>
                                            <i className="ph ph-x"></i> Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="product-details">
                                        <div className="product-price">
                                            <span className="price-value">{product.price}</span>
                                            <span className="price-currency">€</span>
                                        </div>
                                        <div className="product-duration">
                                            <i className="ph ph-clock"></i> {product.duration}
                                        </div>
                                    </div>
                                    <button className="btn-edit-product" onClick={() => handleEdit(product)}>
                                        <i className="ph ph-pencil-simple"></i> Modifier
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
