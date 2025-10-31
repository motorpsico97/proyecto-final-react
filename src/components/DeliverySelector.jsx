import { useState } from 'react';
import '../styles/DeliverySelector.css';

const DeliverySelector = ({ onDeliveryChange, totalPrice }) => {
    const [deliveryType, setDeliveryType] = useState(''); // Sin valor inicial
    const [wantsBag, setWantsBag] = useState(null); // null indica que no se ha seleccionado nada aún

    const handleDeliveryTypeChange = (type) => {
        setDeliveryType(type);
        // Solo enviar actualización si ya se seleccionó una opción de bolsa
        if (wantsBag !== null) {
            onDeliveryChange(type, wantsBag);
        }
    };

    const handleBagChange = (bagOption) => {
        setWantsBag(bagOption);
        if (deliveryType) {
            onDeliveryChange(deliveryType, bagOption);
        }
    };

    const isFreeShipping = totalPrice >= 4000;

    return (
        <div className="delivery-selector">
            <h3 className="delivery-title">Método de Entrega</h3>
            
            <div className="delivery-options">
                <label className={`delivery-option ${deliveryType === 'pickup' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={deliveryType === 'pickup'}
                        onChange={() => handleDeliveryTypeChange('pickup')}
                    />
                    <div className="option-content">
                        <div className="option-info">
                            <h4>Retiro en Tienda</h4>
                            <p>Retira tu pedido en una de nuestras tiendas</p>
                        </div>
                        <div className="option-price">
                            <span className="price">GRATIS</span>
                        </div>
                    </div>
                </label>

                <label className={`delivery-option ${deliveryType === 'shipping' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="deliveryType"
                        value="shipping"
                        checked={deliveryType === 'shipping'}
                        onChange={() => handleDeliveryTypeChange('shipping')}
                    />
                    <div className="option-content">
                        <div className="option-info">
                            <h4>Envío a Domicilio</h4>
                            <p>Recibe tu pedido en la dirección que prefieras</p>
                            {isFreeShipping && (
                                <p className="free-shipping-note">
                                    🎉 ¡Envío gratis por compras superiores a $4000!
                                </p>
                            )}
                        </div>
                        <div className="option-price">
                            <span className={`price ${isFreeShipping ? 'free' : ''}`}>
                                {isFreeShipping ? 'GRATIS' : 'Desde $150'}
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            {/* Opción de bolsa - solo se muestra si se ha seleccionado un método de entrega */}
            {deliveryType && (
                <div className="bag-option-section">
                    <h3 className="bag-title">Opciones de Empaque</h3>
                    <div className="bag-options">
                        <label className={`bag-option ${wantsBag === false ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="bagOption"
                                value="no"
                                checked={wantsBag === false}
                                onChange={() => handleBagChange(false)}
                            />
                            <div className="option-content">
                                <div className="option-info">
                                    <h4>Sin Bolsa</h4>
                                    <p>Producto sin empaque adicional</p>
                                </div>
                                <div className="option-price">
                                    <span className="price">GRATIS</span>
                                </div>
                            </div>
                        </label>

                        <label className={`bag-option ${wantsBag === true ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="bagOption"
                                value="yes"
                                checked={wantsBag === true}
                                onChange={() => handleBagChange(true)}
                            />
                            <div className="option-content">
                                <div className="option-info">
                                    <h4>Con Bolsa de Regalo</h4>
                                    <p>Incluye bolsa premium para regalo</p>
                                </div>
                                <div className="option-price">
                                    <span className="price">$100</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliverySelector;