import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';
import ItemCount from './ItemCount';
import '../styles/ItemDetail.css';

const ItemDetail = ({ product }) => {
    const [stockAdded, setStockAdded] = useState(0);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedTalle, setSelectedTalle] = useState(null);
    const [stockBySize, setStockBySize] = useState(null);
    const [totalStock, setTotalStock] = useState(0);
    const [stockByTalle, setStockByTalle] = useState({}); // Nuevo estado para stock por cada talle
    const [stockByLocationForTalle, setStockByLocationForTalle] = useState({}); // Stock por local para talle seleccionado
    const [detailedStockByTalle, setDetailedStockByTalle] = useState({}); // Stock detallado por talle y local
    const [showStockSummary, setShowStockSummary] = useState(false); // Estado para mostrar/ocultar resumen de stock
    const [countKey, setCountKey] = useState(0);
    const { addItemWithStock, cart } = useCart();
    const navigate = useNavigate();

    const gallery = [product.image, ...(product.galeria || [])].filter(Boolean);
    
    // Extraer talles del nuevo formato (map de maps)
    const sizes = product?.talles && typeof product.talles === 'object' 
        ? Object.keys(product.talles).filter(key => key !== 'valor' && key !== 'stock')
        : [];
    
    // Calcular stock total desde Firebase y obtener datos de talles
    useEffect(() => {
        const fetchTotalStock = async () => {
            if (!product.id) return;
            
            try {
                const docRef = doc(db, 'items', product.id);
                const snap = await getDoc(docRef);
                
                if (snap.exists()) {
                    const data = snap.data();
                    
                    // Nuevo formato: talles es un map de maps con stock como objeto
                    if (data.talles && typeof data.talles === 'object') {
                        let total = 0;
                        Object.keys(data.talles).forEach(talle => {
                            if (talle !== 'valor' && talle !== 'stock' && data.talles[talle]?.stock) {
                                const stockObj = data.talles[talle].stock;
                                if (stockObj && typeof stockObj === 'object') {
                                    // Sumar todo el stock de todos los locales para este talle
                                    const talleTotal = Object.values(stockObj).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                                    total += talleTotal;
                                }
                            }
                        });
                        setTotalStock(total);
                    } else {
                        // Fallback al stock general si no hay talles
                        setTotalStock(data.stock || 0);
                    }
                }
            } catch (error) {
                console.error('Error fetching total stock:', error);
                setTotalStock(0);
            }
        };

        fetchTotalStock();
    }, [product.id]);

    // Calcular stock de todos los talles para la renderización
    useEffect(() => {
        const fetchAllTallesStock = async () => {
            if (!product.id || sizes.length === 0) return;
            
            try {
                const docRef = doc(db, 'items', product.id);
                const snap = await getDoc(docRef);
                
                if (snap.exists()) {
                    const data = snap.data();
                    const stockMap = {};
                    const detailedMap = {};
                    
                    // Calcular stock para cada talle
                    sizes.forEach(talle => {
                        if (data.talles && data.talles[talle] && data.talles[talle].stock) {
                            const stockObj = data.talles[talle].stock;
                            if (stockObj && typeof stockObj === 'object') {
                                const talleStock = Object.values(stockObj).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                                stockMap[talle] = talleStock;
                                // Guardar también el detalle por local
                                detailedMap[talle] = stockObj;
                            } else {
                                stockMap[talle] = 0;
                                detailedMap[talle] = {};
                            }
                        } else {
                            stockMap[talle] = 0;
                            detailedMap[talle] = {};
                        }
                    });
                    
                    setStockByTalle(stockMap);
                    setDetailedStockByTalle(detailedMap);
                }
            } catch (error) {
                console.error('Error fetching all talles stock:', error);
                setStockByTalle({});
                setDetailedStockByTalle({});
            }
        };

        fetchAllTallesStock();
    }, [product.id, sizes]);
    
    // Obtener stock por talle desde Firebase
    useEffect(() => {
        const fetchStockBySize = async () => {
            if (!selectedTalle || !product.id) return;
            
            try {
                const docRef = doc(db, 'items', product.id);
                const snap = await getDoc(docRef);
                
                if (snap.exists()) {
                    const data = snap.data();
                    
                    // Nuevo formato: buscar el talle específico en el map
                    if (data.talles && data.talles[selectedTalle] && data.talles[selectedTalle].stock) {
                        const stockObj = data.talles[selectedTalle].stock;
                        if (stockObj && typeof stockObj === 'object') {
                            // Sumar stock de todos los locales para este talle
                            const talleStock = Object.values(stockObj).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                            setStockBySize(talleStock);
                            // Guardar también el desglose por local
                            setStockByLocationForTalle(stockObj);
                        } else {
                            setStockBySize(0);
                            setStockByLocationForTalle({});
                        }
                    } else {
                        // Fallback al stock general si no se encuentra el talle
                        setStockBySize(data.stock || 0);
                        setStockByLocationForTalle({});
                    }
                }
            } catch (error) {
                console.error('Error fetching stock by size:', error);
                setStockBySize(null);
            }
        };

        fetchStockBySize();
    }, [selectedTalle, product.id]);
    
    // Resetear el contador cuando cambie el talle seleccionado
    useEffect(() => {
        setCountKey(prev => prev + 1);
    }, [selectedTalle]);
    
    // Calcular stock disponible considerando lo que ya está en el carrito
    const getAvailableStock = () => {
        let baseStock = selectedTalle ? stockBySize : totalStock;
        if (baseStock === null || baseStock === undefined) return 0;
        
        // Obtener la cantidad ya en el carrito para este producto y talle específico
        const cartItem = cart.find(item => 
            item.id === product.id && item.talle === selectedTalle
        );
        const stockInCart = cartItem ? cartItem.stock : 0;
        
        return Math.max(0, baseStock - stockInCart);
    };
    
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    const handleKeyDown = (e) => {
        if (isFullScreen) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') setIsFullScreen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullScreen]);

    const handleImageClick = () => {
        setIsFullScreen(true);
    };

    const handleOnAdd = async (stock) => {
        setError('');
        
        // Validar que se haya seleccionado un talle si el producto tiene talles
        if (sizes.length > 0 && !selectedTalle) {
            setError('Por favor, selecciona un talle antes de agregar al carrito');
            return;
        }

        // Validar que la cantidad sea válida
        if (stock <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }

        // Validar stock disponible antes de agregar
        const stockDisponible = getAvailableStock();
        if (stock > stockDisponible) {
            let errorMsg = `Solo hay ${stockDisponible} unidades disponibles`;
            if (selectedTalle) {
                errorMsg += ` para el talle ${selectedTalle}`;
                // Agregar información de locales si está disponible
                if (Object.keys(stockByLocationForTalle).length > 0) {
                    const locales = Object.entries(stockByLocationForTalle)
                        .filter(([, cantidad]) => cantidad > 0)
                        .map(([local, cantidad]) => `${local}: ${cantidad}`)
                        .join(', ');
                    if (locales) {
                        errorMsg += ` (${locales})`;
                    }
                }
            }
            setError(errorMsg);
            return;
        }
        
        const res = await addItemWithStock(product, stock, selectedTalle);
        if (res.success) {
            setStockAdded(prev => prev + stock); // Acumular la cantidad agregada
            // Limpiar error en caso de éxito
            setError('');
            
            // Opcional: Mostrar mensaje de éxito temporal
            // setError(`✅ ${stock} ${stock === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
            // setTimeout(() => setError(''), 3000);
        } else {
            setError(res.message || 'Error al agregar al carrito');
        }
    };

    return (
        <div className="item-detail">
            <div className="item-detail-content">
                <div className="detail-image-container">
                    <img
                        className="detail-main-image"
                        src={gallery[currentImageIndex]}
                        alt={product.title}
                        onClick={handleImageClick}
                    />
                    {isFullScreen && (
                        <div className="fullscreen-overlay" onClick={() => setIsFullScreen(false)}>
                            <div className="fullscreen-content">
                                <button 
                                    className="carousel-button prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                >
                                    ‹
                                </button>
                                <img
                                    src={gallery[currentImageIndex]}
                                    alt={product.title}
                                    className="fullscreen-image"
                                />
                                <button 
                                    className="carousel-button next"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                >
                                    ›
                                </button>
                                <button 
                                    className="close-fullscreen"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFullScreen(false);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="detail-gallery">
                        {gallery.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.title} - imagen ${index + 1}`}
                                className={`gallery-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="detail-info">
                    <h2 className="detail-title">{product.title}</h2>
                    <p className="detail-description">{product.description}</p>
                    <div className="detail-price">
                        ${product.price}
                    </div>
                    {sizes.length > 0 && (
                        <div className="sizes-container">
                            <p className="sizes-label">Talles</p>
                            <div className="sizes-grid">
                                {sizes.map((size, idx) => {
                                    const sizeStock = stockByTalle[size] || 0;
                                    const hasStock = sizeStock > 0;
                                    const isSelected = selectedTalle === size;
                                    return (
                                        <button
                                            type="button"
                                            key={`${size}-${idx}`}
                                            className={`size-option ${isSelected ? 'selected' : ''} ${!hasStock ? 'disabled' : ''}`}
                                            onClick={() => hasStock && setSelectedTalle(size)}
                                            disabled={!hasStock}
                                            aria-pressed={isSelected}
                                            aria-disabled={!hasStock}
                                            title={!hasStock ? 'Sin stock' : `Talle ${size} - Stock: ${sizeStock}`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Botón para mostrar/ocultar resumen de stock */}
                            <div className="stock-toggle-container" style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowStockSummary(true)}
                                    className="stock-toggle-button"
                                >
                                    Ver stock
                                </button>
                            </div>
                        </div>
                    )}
                    {selectedTalle && stockBySize !== null && (
                        <div className="size-stock-info">
                            <p>
                                <strong>Stock disponible para talle {selectedTalle}:</strong> {getAvailableStock()} unidades
                                {cart.find(item => item.id === product.id && item.talle === selectedTalle) && (
                                    <span className="cart-quantity-info">
                                        {' '}(ya tienes {cart.find(item => item.id === product.id && item.talle === selectedTalle)?.stock} en el carrito)
                                    </span>
                                )}
                            </p>
                            {/* Mostrar stock por local para el talle seleccionado */}
                            {Object.keys(stockByLocationForTalle).length > 0 && (
                                <div className="stock-by-location">
                                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
                                        <strong>Disponibilidad por local:</strong>
                                    </p>
                                    <div style={{ fontSize: '0.85em', color: '#777', marginTop: '0.25rem' }}>
                                        {Object.entries(stockByLocationForTalle).map(([local, cantidad]) => (
                                            <div key={local} style={{ marginBottom: '0.2rem' }}>
                                                • {local}: {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    )}
                    <div className="detail-stock">
                        <p>Stock total disponible: {totalStock} unidades</p>
                        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                    </div>
                    <div className="detail-actions">
                        <ItemCount
                            key={countKey}
                            stock={getAvailableStock()}
                            initial={1}
                            onAdd={handleOnAdd}
                        />
                        {stockAdded > 0 && (
                            <div className="action-buttons">
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="finish-button"
                                >
                                    Terminar compra
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="continue-button"
                                >
                                    Seguir comprando
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Stock */}
            {showStockSummary && (
                <div 
                    className="stock-modal-overlay" 
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowStockSummary(false);
                        }
                    }}
                >
                    <div className="stock-modal-content">
                        {/* Botón de cerrar */}
                        <button
                            onClick={() => setShowStockSummary(false)}
                            className="stock-modal-close"
                        >
                            ✕
                        </button>

                        {/* Contenido del modal */}
                        <div className="modal-header">
                            <h3 className="modal-title">
                                Stock Disponible - {product.title}
                            </h3>
                        </div>

                        {Object.keys(stockByTalle).length > 0 ? (
                            <>
                                <div className="stock-grid">
                                    {Object.entries(stockByTalle).map(([talle, cantidad]) => {
                                        const localesData = detailedStockByTalle[talle] || {};
                                        return (
                                            <div key={talle} className={`stock-talle-card ${cantidad > 0 ? 'has-stock' : 'no-stock'}`}>
                                                <div className={`stock-talle-title ${cantidad > 0 ? 'has-stock' : 'no-stock'}`}>
                                                    Talle {talle}
                                                </div>
                                                <div className="stock-talle-total">
                                                    Total: {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
                                                </div>
                                                
                                                {cantidad > 0 ? (
                                                    <div className="stock-locations-section">
                                                        <div className="stock-locations-title">
                                                            📍 Disponibilidad por local:
                                                        </div>
                                                        <div className="stock-locations-list">
                                                            {Object.entries(localesData).map(([local, cant]) => (
                                                                <div key={local} className="stock-location-item">
                                                                    <span>• {local}</span>
                                                                    <span className="stock-location-quantity">{cant}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="stock-no-available">
                                                        ❌ Sin stock disponible
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total general */}
                                <div className="stock-total-general">
                                    Stock Total del Producto: {totalStock} unidades
                                </div>
                            </>
                        ) : (
                            <div className="stock-no-info">
                                No hay información de stock disponible
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;