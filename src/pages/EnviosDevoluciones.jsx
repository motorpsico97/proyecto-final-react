import { useEffect } from 'react';
import '../styles/EnviosDevoluciones.css';

const EnviosDevoluciones = () => {
    useEffect(() => {
        document.title = 'Envíos y Devoluciones | Shoes Store';
    }, []);
    return (
        <div className="envios-container">
            <div className="page-header">
                <h1>Envíos y Devoluciones</h1>
                <p>Toda la información sobre nuestros servicios de entrega y política de devoluciones</p>
            </div>

            <div className="content-sections">
                {/* Sección Envíos */}
                <section className="info-section">
                    <div className="section-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <h2>Información de Envíos</h2>
                    
                    <div className="info-card">
                        <h3>Tiempos de Entrega</h3>
                        <ul>
                            <li><strong>Montevideo:</strong> 24-48 horas hábiles</li>
                            <li><strong>Interior de Uruguay:</strong> 3-5 días hábiles</li>
                            <li><strong>Envíos Internacionales:</strong> 7-15 días hábiles</li>
                        </ul>
                        <p className="note">Los tiempos pueden variar durante temporadas altas o feriados.</p>
                    </div>

                    <div className="info-card">
                        <h3>Costos de Envío</h3>
                        <div className="pricing-table">
                            <div className="pricing-row">
                                <span className="location">Montevideo</span>
                                <span className="price">$150</span>
                            </div>
                            <div className="pricing-row">
                                <span className="location">Interior Uruguay</span>
                                <span className="price">$250</span>
                            </div>
                            <div className="pricing-row">
                                <span className="location">Internacionales</span>
                                <span className="price">$2000</span>
                            </div>
                            <div className="pricing-row highlight">
                                <span className="location-2000">Compras sobre $2000</span>
                                <span className="price">¡GRATIS!</span>
                            </div>
                        </div>
                        <p className="note">El costo exacto se calculará en el checkout según tu ubicación.</p>
                    </div>

                    <div className="info-card">
                        <h3>Seguimiento de Pedidos</h3>
                        <p>Una vez despachado tu pedido, recibirás:</p>
                        <ul>
                            <li>Email de confirmación con número de seguimiento</li>
                            <li>Link para rastrear tu envío en tiempo real</li>
                            <li>Notificaciones de estado de entrega</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h3>Métodos de Entrega</h3>
                        <p>Trabajamos con las siguientes empresas de transporte:</p>
                        <div className="transport-logos">
                            <span className="transport-item">📦 UES</span>
                            <span className="transport-item">📦 DAC</span>
                            <span className="transport-item">📦 Mirtrans</span>
                        </div>
                    </div>
                </section>

                {/* Sección Devoluciones */}
                <section className="info-section">
                    <div className="section-icon returns">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </div>
                    <h2>Política de Devoluciones</h2>
                    
                    <div className="info-card">
                        <h3>Condiciones Generales</h3>
                        <p>Aceptamos devoluciones bajo las siguientes condiciones:</p>
                        <ul>
                            <li>Dentro de los <strong>30 días</strong> posteriores a la compra</li>
                            <li>Productos sin usar y en perfecto estado</li>
                            <li>Con etiquetas y empaques originales</li>
                            <li>Acompañado de comprobante de compra</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h3>¿Cómo Devolver un Producto?</h3>
                        <div className="steps">
                            <div className="step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h4>Contáctanos</h4>
                                    <p>Envía un email o completa el formulario de contacto con tu número de pedido</p>
                                </div>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h4>Autorización</h4>
                                    <p>Recibirás un código de autorización y las instrucciones de devolución</p>
                                </div>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h4>Envío</h4>
                                    <p>Empaca el producto y envíalo a nuestra dirección (costo a cargo del cliente)</p>
                                </div>
                            </div>
                            <div className="step">
                                <span className="step-number">4</span>
                                <div className="step-content">
                                    <h4>Reembolso</h4>
                                    <p>Procesaremos tu reembolso en 5-7 días hábiles tras recibir el producto</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Cambios por Talla o Color</h3>
                        <p>Si necesitas cambiar la talla o color de tu producto:</p>
                        <ul>
                            <li>Primer cambio sin costo adicional</li>
                            <li>Sujeto a disponibilidad de stock</li>
                            <li>Mismo proceso que una devolución</li>
                        </ul>
                    </div>

                    <div className="info-card alert">
                        <h3>⚠️ Productos No Retornables</h3>
                        <ul>
                            <li>Productos en liquidación o descuento superior al 50%</li>
                            <li>Artículos personalizados o de pedido especial</li>
                            <li>Productos con signos de uso o daño</li>
                            <li>Artículos sin etiquetas originales</li>
                        </ul>
                    </div>
                </section>

                
            </div>

            {/* CTA */}
            <div className="help-cta">
                <h3>¿Necesitas ayuda con tu pedido?</h3>
                <p>Nuestro equipo está disponible para asistirte</p>
                <div className="cta-buttons">
                    <a href="/contacto" className="btn-primary">Contactar Soporte</a>
                    <a href="/ayuda" className="btn-secondary">Ver Preguntas Frecuentes</a>
                </div>
            </div>
        </div>
    );
};

export default EnviosDevoluciones;
