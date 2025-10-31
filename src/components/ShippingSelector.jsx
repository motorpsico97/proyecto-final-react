import { useState, useEffect } from 'react';
import '../styles/ShippingSelector.css';

const ShippingSelector = ({ onShippingChange, totalPrice }) => {
    const [shippingType, setShippingType] = useState('domestic');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [address, setAddress] = useState('');
    const [shippingCost, setShippingCost] = useState(0);

    // Departamentos de Uruguay
    const uruguayanDepartments = [
        'Montevideo', 'Canelones', 'Maldonado', 'Rocha', 'Treinta y Tres',
        'Cerro Largo', 'Rivera', 'Artigas', 'Salto', 'Paysandú',
        'Río Negro', 'Soriano', 'Colonia', 'San José', 'Flores',
        'Florida', 'Durazno', 'Tacuarembó', 'Lavalleja'
    ];

    // Países para envío internacional
    const countries = [
        'Argentina', 'Brasil', 'Chile', 'Paraguay', 'Bolivia',
        'Colombia', 'Venezuela', 'Ecuador', 'Perú', 'Estados Unidos',
        'México', 'España', 'Francia', 'Italia', 'Alemania',
        'Reino Unido', 'Canadá', 'Australia', 'Japón', 'China'
    ];

    const isFreeShipping = totalPrice >= 4000;

    // Calcular costo de envío
    useEffect(() => {
        let cost = 0;
        if (shippingType === 'domestic') {
            // Solo envíos nacionales pueden ser gratis con compras +$4000
            if (isFreeShipping) {
                cost = 0;
            } else if (selectedDepartment === 'Montevideo') {
                cost = 150;
            } else if (selectedDepartment) {
                cost = 250;
            }
        } else if (shippingType === 'international' && selectedCountry) {
            // Envíos internacionales siempre cuestan $2000
            cost = 2000;
        }
        
        setShippingCost(cost);
    }, [shippingType, selectedDepartment, selectedCountry, isFreeShipping]);

    // Notificar cambios al componente padre
    useEffect(() => {
        const shippingData = {
            type: shippingType,
            cost: shippingCost,
            destination: shippingType === 'domestic' ? selectedDepartment : selectedCountry,
            address: address,
            isComplete: shippingType === 'domestic' ? 
                (selectedDepartment && address) : 
                (selectedCountry && address)
        };
        
        onShippingChange(shippingData);
    }, [shippingType, shippingCost, selectedDepartment, selectedCountry, address, onShippingChange]);

    const handleShippingTypeChange = (type) => {
        setShippingType(type);
        setSelectedDepartment('');
        setSelectedCountry('');
        setAddress('');
    };

    return (
        <div className="shipping-selector">
            <h4>Detalles de Envío</h4>
            
            {isFreeShipping && shippingType === 'domestic' && (
                <div className="free-shipping-banner">
                    🎉 ¡Envío gratuito para Uruguay! Tu compra supera los $4000
                </div>
            )}

            <div className="shipping-type-selector">
                <label className={`shipping-type-option ${shippingType === 'domestic' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="shippingType"
                        value="domestic"
                        checked={shippingType === 'domestic'}
                        onChange={() => handleShippingTypeChange('domestic')}
                    />
                    <div className="option-content">
                        <h5>Envío Nacional (Uruguay)</h5>
                        <p className="shipping-cost">
                            {isFreeShipping ? 'GRATIS' : 'Montevideo: $150 | Interior: $250'}
                        </p>
                    </div>
                </label>

                <label className={`shipping-type-option ${shippingType === 'international' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="shippingType"
                        value="international"
                        checked={shippingType === 'international'}
                        onChange={() => handleShippingTypeChange('international')}
                    />
                    <div className="option-content">
                        <h5>Envío Internacional</h5>
                        <p className="shipping-cost">
                            $2000
                        </p>
                    </div>
                </label>
            </div>

            <div className="shipping-details">
                {shippingType === 'domestic' && (
                    <div className="domestic-shipping">
                        <div className="form-group">
                            <label htmlFor="department">Departamento *</label>
                            <select
                                id="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un departamento</option>
                                {uruguayanDepartments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {shippingType === 'international' && (
                    <div className="international-shipping">
                        <div className="form-group">
                            <label htmlFor="country">País *</label>
                            <select
                                id="country"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="address">Dirección Completa *</label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ingresa tu dirección completa (calle, número, apartamento, código postal, etc.)"
                        rows="3"
                        required
                    />
                </div>

                {(selectedDepartment || selectedCountry) && address && (
                    <div className="shipping-summary">
                        <h5>Resumen de Envío:</h5>
                        <p><strong>Destino:</strong> {selectedDepartment || selectedCountry}</p>
                        <p><strong>Dirección:</strong> {address}</p>
                        <p><strong>Costo:</strong> 
                            <span className={`cost ${shippingCost === 0 ? 'free' : ''}`}>
                                {shippingCost === 0 ? ' GRATIS' : ` $${shippingCost}`}
                            </span>
                        </p>
                        <p className="delivery-time">
                            🚚 Tiempo estimado: {shippingType === 'domestic' ? '3-5 días hábiles' : '7-15 días hábiles'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingSelector;