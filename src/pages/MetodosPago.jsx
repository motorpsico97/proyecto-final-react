import { useEffect } from 'react';
import '../styles/MetodosPago.css';

const MetodosPago = () => {
    useEffect(() => {
        document.title = 'Métodos de Pago | Shoes Store';
    }, []);
    return (
        <div className="metodos-pago-container">
            <div className="page-header">
                <h1>Métodos de Pago</h1>
                <p>Ofrecemos diversas opciones para que elijas la que más te convenga</p>
            </div>

            <div className="security-banner">
                <div className="security-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className='transaction'>
                    <h3>🔒 Compra 100% Segura</h3>
                    <p>Todas las transacciones están protegidas con encriptación SSL de 256 bits</p>
                </div>
            </div>

            <div className="payment-methods">
                <div className="payment-method-card">
                    <div className="method-header">
                        <div className="method-icon cards">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='credit'>
                                <path strokeLinecap="round"  strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3>Tarjetas de Crédito y Débito</h3>
                    </div>
                    <div className="method-content">
                        <p className="method-description">
                            Aceptamos las principales tarjetas bancarias del mercado.
                        </p>
                        <div className="card-brands">
                            <div className="brand-item">
                                <span className="brand-logo">💳</span>
                                <span className="brand-name">Visa</span>
                            </div>
                            <div className="brand-item">
                                <span className="brand-logo">💳</span>
                                <span className="brand-name">Mastercard</span>
                            </div>
                            <div className="brand-item">
                                <span className="brand-logo">💳</span>
                                <span className="brand-name">American Express</span>
                            </div>
                        </div>
                        <div className="method-benefits">
                            <h4>Beneficios:</h4>
                            <ul>
                                <li>✓ Pago en cuotas (según tu banco)</li>
                                <li>✓ Procesamiento inmediato</li>
                                <li>✓ Sin cargos adicionales</li>
                                <li>✓ Máxima seguridad</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="payment-method-card">
                    <div className="method-header">
                        <div className="method-icon paypal">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='paypal-logo'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3>PayPal</h3>
                    </div>
                    <div className="method-content">
                        <p className="method-description">
                            Paga de forma rápida y segura con tu cuenta de PayPal.
                        </p>
                        <div className="paypal-logo-display">
                            <span className="paypal-text">PayPal</span>
                        </div>
                        <div className="method-benefits">
                            <h4>Beneficios:</h4>
                            <ul>
                                <li>✓ No compartes datos bancarios</li>
                                <li>✓ Protección al comprador</li>
                                <li>✓ Pago en segundos</li>
                                <li>✓ Disponible internacionalmente</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="payment-method-card">
                    <div className="method-header">
                        <div className="method-icon transfer">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='transfer-icon'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h3>Transferencia Bancaria</h3>
                    </div>
                    <div className="method-content">
                        <p className="method-description">
                            Realiza una transferencia directa a nuestra cuenta bancaria.
                        </p>
                        <div className="bank-info">
                            <h4>Datos Bancarios:</h4>
                            <div className="bank-details">
                                <p><strong>Banco:</strong> Banco República (BROU)</p>
                                <p><strong>Cuenta:</strong> CA 000000000-00</p>
                                <p><strong>Titular:</strong> Shoes Store S.A.</p>
                                <p><strong>RUT:</strong> 210000000000</p>
                            </div>
                        </div>
                        <div className="method-benefits">
                            <h4>Importante:</h4>
                            <ul>
                                <li>⚠️ Envía el comprobante por email</li>
                                <li>⚠️ Incluye número de pedido</li>
                                <li>⚠️ Procesamiento en 24-48 horas</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="payment-method-card">
                    <div className="method-header">
                        <div className="method-icon mercadopago">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='mercadopago-logo'>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3>Mercado Pago</h3>
                    </div>
                    <div className="method-content">
                        <p className="method-description">
                            Paga con Mercado Pago y accede a beneficios exclusivos.
                        </p>
                        <div className="method-benefits">
                            <h4>Beneficios:</h4>
                            <ul>
                                <li>✓ Cuotas sin interés (según promoción)</li>
                                <li>✓ Dinero en cuenta de Mercado Pago</li>
                                <li>✓ Pago con código QR</li>
                                <li>✓ Protección de compra</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className="help-section">
                <h3>¿Problemas con tu pago?</h3>
                <p>Nuestro equipo de soporte está disponible para ayudarte</p>
                <div className="help-buttons">
                    <a href="/contacto" className="btn-primary">Contactar Soporte</a>
                    <a href="/ayuda" className="btn-secondary">Centro de Ayuda</a>
                </div>
            </div>
        </div>
    );
};

export default MetodosPago;
