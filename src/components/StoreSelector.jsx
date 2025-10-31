import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../styles/StoreSelector.css';

const StoreSelector = ({ onStoreChange }) => {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const storesRef = collection(db, 'locales');
                const snapshot = await getDocs(storesRef);
                
                const storesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setStores(storesData);
                setError('');
            } catch (err) {
                console.error('Error fetching stores:', err);
                setError('Error al cargar las tiendas. Intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const handleStoreChange = (storeId) => {
        setSelectedStore(storeId);
        const store = stores.find(s => s.id === storeId);
        onStoreChange(store);
    };

    if (loading) {
        return (
            <div className="store-selector loading">
                <h4>Seleccionar Tienda</h4>
                <div className="loading-message">
                    <div className="loading-spinner"></div>
                    <p>Cargando tiendas disponibles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="store-selector error">
                <h4>Seleccionar Tienda</h4>
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="store-selector">
            <h4>Seleccionar Tienda para Retiro</h4>
            <p className="store-selector-description">
                Elige la tienda donde prefieres retirar tu pedido
            </p>
            
            <div className="stores-list">
                {stores.length === 0 ? (
                    <div className="no-stores">
                        <p>No hay tiendas disponibles en este momento.</p>
                    </div>
                ) : (
                    stores.map(store => (
                        <label 
                            key={store.id} 
                            className={`store-option ${selectedStore === store.id ? 'selected' : ''}`}
                        >
                            <input
                                type="radio"
                                name="selectedStore"
                                value={store.id}
                                checked={selectedStore === store.id}
                                onChange={() => handleStoreChange(store.id)}
                            />
                            <div className="store-info">
                                <h5 className="store-name">{store.nombre || store.name}</h5>
                                <p className="store-address">
                                    {store.direccion || store.address}
                                </p>
                                {store.telefono && (
                                    <p className="store-phone">
                                        📞 {store.telefono}
                                    </p>
                                )}
                                {store.horario && (
                                    <p className="store-hours">
                                        🕒 {store.horario}
                                    </p>
                                )}
                                {store.departamento && (
                                    <p className="store-department">
                                        📍 {store.departamento}
                                    </p>
                                )}
                            </div>
                        </label>
                    ))
                )}
            </div>
            
            {selectedStore && (
                <div className="selected-store-summary">
                    <h5>Tienda seleccionada:</h5>
                    <p>{stores.find(s => s.id === selectedStore)?.nombre}</p>
                    <p className="pickup-note">
                        💡 Tu pedido estará listo para retirar en 2-3 días hábiles
                    </p>
                </div>
            )}
        </div>
    );
};

export default StoreSelector;