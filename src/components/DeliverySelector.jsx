import { useState } from 'react';
import '../styles/DeliverySelector.css';

/** Selector de método de entrega y opciones de empaque. Permite al usuario elegir entre retiro en tienda o envío a domicilio
 * También maneja la opción de bolsa de regalo y calcula envío gratis */
const DeliverySelector = ({ onDeliveryChange, totalPrice }) => {
    // Estado para el tipo de entrega seleccionado ('pickup' o 'shipping')
    const [deliveryType, setDeliveryType] = useState(''); 
    // Estado para la opción de bolsa (true=con bolsa, false=sin bolsa, null=no seleccionado)
    const [wantsBag, setWantsBag] = useState(null); 

    /** Función para manejar cambios en el tipo de entrega. Solo comunica el cambio al componente padre si ya se seleccionó una opción de bolsa
     */
    const handleDeliveryTypeChange = (type) => {
        setDeliveryType(type);
        if (wantsBag !== null) {
            onDeliveryChange(type, wantsBag);
        }
    };

    /** Función para manejar cambios en la opción de bolsa. Comunica el cambio al componente padre si ya hay un tipo de entrega seleccionado
     */
    const handleBagChange = (bagOption) => {
        setWantsBag(bagOption);
        if (deliveryType) {
            onDeliveryChange(deliveryType, bagOption);
        }
    };

    // Verificar si aplica envío gratis (compras superiores a $4000)
    const isFreeShipping = totalPrice >= 4000;

    return (
        <div className="delivery-selector">
            <h3 className="delivery-title">Método de Entrega</h3>
            
            <div className="delivery-options">
                {/* Opción: Retiro en tienda (siempre gratis) */}
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

                {/* Opción: Envío a domicilio (gratis si cumple condiciones) */}
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
                            {/* Mostrar mensaje de envío gratis si aplica */}
                            {isFreeShipping && (
                                <p className="free-shipping-note">
                                    🎉 ¡Envío gratis por compras superiores a $4000!
                                </p>
                            )}
                        </div>
                        <div className="option-price">
                            {/* Precio dinámico basado en si aplica envío gratis */}
                            <span className={`price ${isFreeShipping ? 'free' : ''}`}>
                                {isFreeShipping ? 'GRATIS' : 'Desde $150'}
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            {/* Sección de opciones de empaque - solo visible después de seleccionar método de entrega */}
            {deliveryType && (
                <div className="bag-option-section">
                    <h3 className="bag-title">Opciones de Empaque</h3>
                    <div className="bag-options">
                        {/* Opción: Sin bolsa (gratis) */}
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

                        {/* Opción: Con bolsa de regalo ($100 adicional) */}
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