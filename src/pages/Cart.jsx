import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import DeliverySelector from '../components/DeliverySelector';
import StoreSelector from '../components/StoreSelector';
import ShippingSelector from '../components/ShippingSelector';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
    const { cart, clearCart, getTotalPrice, getTotalStock } = useCart();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // Paso actual: 1, 2, 3
    const [deliveryType, setDeliveryType] = useState(''); // Sin valor inicial
    const [selectedStore, setSelectedStore] = useState(null);
    const [shippingData, setShippingData] = useState(null);
    const [wantsBag, setWantsBag] = useState(false); // Estado para la bolsa
    const [bagOptionSelected, setBagOptionSelected] = useState(false); // Para validar que se haya seleccionado una opción de empaque
    const [totalWithShipping, setTotalWithShipping] = useState(0);

    const subtotal = getTotalPrice();
    const bagCost = wantsBag ? 100 : 0;

    useEffect(() => {
        document.title = 'Carrito | Shoes Store';
    }, []);

    // Calcular total con envío y bolsa
    useEffect(() => {
        const shippingCost = deliveryType === 'pickup' ? 0 : (shippingData?.cost || 0);
        setTotalWithShipping(subtotal + shippingCost + bagCost);
    }, [subtotal, deliveryType, shippingData, bagCost]);

    const handleDeliveryChange = (type, bagOption) => {
        setDeliveryType(type);
        // Solo actualizar si se proporciona una opción de bolsa válida
        if (bagOption !== undefined && bagOption !== null) {
            setWantsBag(bagOption);
            setBagOptionSelected(true);
        } else {
            // Reset bag selection when delivery type changes but no bag option provided
            setBagOptionSelected(false);
        }
        setSelectedStore(null);
        setShippingData(null);
    };

    const handleStoreChange = (store) => {
        setSelectedStore(store);
    };

    const handleShippingChange = (shipping) => {
        setShippingData(shipping);
    };

    // Funciones para navegación entre pasos
    const goToNextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const goToPreviousStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Validar si se puede continuar al siguiente paso
    const canContinueToDelivery = () => {
        return cart.length > 0;
    };

    const canContinueToPayment = () => {
        // 1. Debe haber seleccionado un método de entrega
        if (!deliveryType) {
            return false;
        }

        // 2. Debe haber seleccionado explícitamente una opción de empaque
        if (!bagOptionSelected) {
            return false;
        }

        // 3. Validar según el tipo de entrega seleccionado
        if (deliveryType === 'pickup') {
            // Para retiro en tienda: debe haber seleccionado una tienda
            if (!selectedStore) {
                return false;
            }
        } else if (deliveryType === 'shipping') {
            // Para envío a domicilio: debe haber completado los datos de envío
            if (!shippingData || !shippingData.isComplete) {
                return false;
            }
        }

        return true;
    };

    const getValidationMessage = () => {
        if (!deliveryType) {
            return "Selecciona un método de entrega";
        }
        if (!bagOptionSelected) {
            return "Selecciona una opción de empaque";
        }
        if (deliveryType === 'pickup' && !selectedStore) {
            return "Selecciona una tienda para el retiro";
        }
        if (deliveryType === 'shipping' && (!shippingData || !shippingData.isComplete)) {
            return "Completa los datos de envío";
        }
        return "";
    };

    const isCheckoutReady = () => {
        if (!deliveryType) {
            return false; // No se ha seleccionado método de entrega
        }
        if (deliveryType === 'pickup') {
            return selectedStore !== null;
        } else {
            return shippingData?.isComplete || false;
        }
    };

    useEffect(() => {
        document.title = 'Carrito | Shoes Store';
    }, []);

    if (cart.length === 0) {
        return (
            <div className="empty-cart-message">
                <h2 className="cart-title">Carrito vacío</h2>
                <Link to="/" className="shop-link">
                    Ir a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2 className="cart-title">Tu Carrito</h2>

            {/* Indicador de pasos */}
            <div className="cart-steps-indicator">
                <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Productos</span>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Entrega</span>
                </div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Resumen</span>
                </div>
            </div>

            {/* PASO 1: PRODUCTOS Y TOTALES */}
            {currentStep === 1 && (
                <div className="cart-step-content">
                    <div className="cart-two-columns">
                        {/* Columna de productos */}
                        <div className="column products-column">
                            <div className="column-header">
                                <h3>Productos ({getTotalStock()} items)</h3>
                            </div>
                            <div className="column-content">
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <CartItem key={`${item.id}-${item.talle || 'notalle'}`} item={item} />
                                    ))}
                                </div>
                                <div className="products-actions">
                                    <button
                                        onClick={clearCart}
                                        className="clear-cart-button"
                                    >
                                        🗑️ Vaciar carrito
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Columna de totales */}
                        <div className="column totals-column">
                            <div className="column-header">
                                <h3>Resumen</h3>
                            </div>
                            <div className="column-content">
                                <div className="summary-details">
                                    <div className="summary-line">
                                        <span>Subtotal:</span>
                                        <span>${subtotal}</span>
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-line total">
                                        <span>Total:</span>
                                        <span>${subtotal}</span>
                                    </div>
                                </div>

                                <div className="step-navigation">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="back-button"
                                    >
                                        Seguir comprando
                                    </button>
                                    <button
                                        onClick={goToNextStep}
                                        className={`continue-button ${!canContinueToDelivery() ? 'disabled' : ''}`}
                                        disabled={!canContinueToDelivery()}
                                    >
                                        Continuar a método de entrega
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PASO 2: MÉTODO DE ENTREGA */}
            {currentStep === 2 && (
                <div className="cart-step-content">
                    <div className="delivery-section">
                        <div className="column-header">
                            <h3>Selecciona tu método de entrega</h3>
                        </div>
                        <div className="column-content">
                            <DeliverySelector
                                onDeliveryChange={handleDeliveryChange}
                                totalPrice={subtotal}
                            />

                            {deliveryType === 'pickup' && (
                                <StoreSelector
                                    onStoreChange={handleStoreChange}
                                />
                            )}

                            {deliveryType === 'shipping' && (
                                <ShippingSelector
                                    onShippingChange={handleShippingChange}
                                    totalPrice={subtotal}
                                />
                            )}
                        </div>

                        <div className="step-navigation">
                            <button
                                onClick={goToPreviousStep}
                                className="back-button"
                            >
                                ← Volver a productos
                            </button>
                            
                            {!canContinueToPayment() && (
                                <div className="validation-message">
                                    <p>{getValidationMessage()}</p>
                                </div>
                            )}
                            
                            <button
                                onClick={goToNextStep}
                                className={`continue-button ${!canContinueToPayment() ? 'disabled' : ''}`}
                                disabled={!canContinueToPayment()}
                            >
                                Continuar al pago
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PASO 3: RESUMEN DEL PEDIDO */}
            {currentStep === 3 && (
                <div className="cart-step-content">
                    <div className="order-summary">
                        <div className="column-header">
                            <h3>Resumen del Pedido</h3>
                        </div>
                        
                        {/* Productos seleccionados */}
                        <div className="summary-section">
                            <h4>Productos ({getTotalStock()} items)</h4>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.talle || 'notalle'}`} className="summary-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.title}</span>
                                            {item.talle && <span className="item-size">Talle: {item.talle}</span>}
                                        </div>
                                        <div className="item-quantity">x{item.stock}</div>
                                        <div className="item-price">${item.price * item.stock}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Método de entrega seleccionado */}
                        <div className="summary-section">
                            <h4>Método de Entrega</h4>
                            <div className="delivery-info">
                                {deliveryType === 'pickup' ? (
                                    <div>
                                        <p><strong>Retiro en tienda</strong></p>
                                        {selectedStore && (
                                            <p>{selectedStore.nombre} - {selectedStore.direccion}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Envío a domicilio</strong></p>
                                        {shippingData && (
                                            <p>{shippingData.location} - ${shippingData.cost}</p>
                                        )}
                                    </div>
                                )}
                                
                                {/* Información de empaque */}
                                <div className='delivery-sub-info'>
                                    <p><strong>Empaque:</strong> {wantsBag ? 'Con bolsa de regalo (+$100)' : 'Sin bolsa'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Totales finales */}
                        <div className="summary-section">
                            <div className="summary-details">
                                <div className="summary-line">
                                    <span>Subtotal:</span>
                                    <span>${subtotal}</span>
                                </div>

                                {deliveryType === 'shipping' && shippingData?.cost > 0 && (
                                    <div className="summary-line shipping-cost">
                                        <span>Envío:</span>
                                        <span>${shippingData.cost}</span>
                                    </div>
                                )}

                                {deliveryType === 'pickup' && (
                                    <div className="summary-line shipping-cost">
                                        <span>Retiro en tienda:</span>
                                        <span className="free">GRATIS</span>
                                    </div>
                                )}

                                {wantsBag && (
                                    <div className="summary-line bag-cost">
                                        <span>Bolsa de regalo:</span>
                                        <span>$100</span>
                                    </div>
                                )}

                                <div className="summary-divider"></div>

                                <div className="summary-line total">
                                    <span>Total:</span>
                                    <span>${totalWithShipping}</span>
                                </div>
                            </div>
                        </div>

                        <div className="step-navigation">
                            <button
                                onClick={goToPreviousStep}
                                className="back-button"
                            >
                                ← Volver a entrega
                            </button>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="checkout-button"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;