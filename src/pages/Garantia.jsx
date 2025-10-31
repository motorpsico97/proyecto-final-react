import { useEffect } from 'react';
import '../styles/Garantia.css';

const Garantia = () => {
    useEffect(() => {
        document.title = 'Garantía | Shoes Store';
    }, []);
    return (
        <div className="garantia-container">
            <div className="page-header">
                <h1>Política de Garantía</h1>
                <p>Protegemos tu inversión en productos deportivos de calidad</p>
            </div>

            <div className="guarantee-hero">
                <div className="hero-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2>Garantía de Calidad Total</h2>
                <p>Todos nuestros productos cuentan con garantía oficial del fabricante</p>
            </div>

            <div className="content-grid">
                <div className="guarantee-card">
                    <div className="card-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='period'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Período de Garantía</h3>
                    <div className="guarantee-periods">
                        <div className="period-item">
                            <span className="period-duration">90 días</span>
                            <span className="period-desc">Calzado Deportivo</span>
                        </div>
                        <div className="period-item">
                            <span className="period-duration">60 días</span>
                            <span className="period-desc">Ropa y Accesorios</span>
                        </div>
                        <div className="period-item">
                            <span className="period-duration">6 meses</span>
                            <span className="period-desc">Equipamiento Especializado</span>
                        </div>
                    </div>
                </div>

                <div className="guarantee-card">
                    <div className="card-icon covered">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='policy'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>¿Qué Cubre la Garantía?</h3>
                    <ul className="coverage-list">
                        <li>Defectos de fabricación</li>
                        <li>Problemas de costuras o pegamento</li>
                        <li>Desprendimiento de suelas</li>
                        <li>Desperfectos en cierres y velcros</li>
                        <li>Decoloración anormal de materiales</li>
                        <li>Fallas en tecnologías de amortiguación</li>
                    </ul>
                </div>

                <div className="guarantee-card alert-card">
                    <div className="card-icon not-covered">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='notCovered'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>¿Qué NO Cubre?</h3>
                    <ul className="not-covered-list">
                        <li>Desgaste normal por uso</li>
                        <li>Daños por mal uso o negligencia</li>
                        <li>Alteraciones o reparaciones no autorizadas</li>
                        <li>Accidentes o daño intencional</li>
                        <li>Uso inadecuado del producto</li>
                        <li>Lavado incorrecto de prendas</li>
                    </ul>
                </div>

                <div className="guarantee-card process-card">
                    <div className="card-icon process">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='claim'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3>Proceso de Reclamo</h3>
                    <div className="process-steps">
                        <div className="process-step">
                            <span className="step-num">1</span>
                            <div className="step-info">
                                <h4>Contacto Inicial</h4>
                                <p>Completa el formulario de reclamo de garantía o contáctanos por email con:</p>
                                <ul>
                                    <li>Número de pedido</li>
                                    <li>Fotos del defecto</li>
                                    <li>Descripción del problema</li>
                                </ul>
                            </div>
                        </div>
                        <div className="process-step">
                            <span className="step-num">2</span>
                            <div className="step-info">
                                <h4>Evaluación</h4>
                                <p>Nuestro equipo revisará tu caso en 24-48 horas y te indicará si aplica la garantía.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <span className="step-num">3</span>
                            <div className="step-info">
                                <h4>Envío del Producto</h4>
                                <p>Si tu reclamo es aprobado, coordinaremos la recolección del producto (sin costo para ti).</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <span className="step-num">4</span>
                            <div className="step-info">
                                <h4>Resolución</h4>
                                <p>Según el caso, procederemos con:</p>
                                <ul>
                                    <li>Reparación del producto</li>
                                    <li>Reemplazo por uno nuevo</li>
                                    <li>Reembolso total</li>
                                </ul>
                                <p className="resolution-time">Tiempo estimado: 7-10 días hábiles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tips-section">
                <h2>💡 Consejos para Mantener tu Garantía Válida</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">🧾</span>
                        <h4>Conserva el Comprobante</h4>
                        <p>Guarda el ticket o factura de compra en un lugar seguro.</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">👟</span>
                        <h4>Uso Apropiado</h4>
                        <p>Utiliza el producto para la actividad prevista.</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🧼</span>
                        <h4>Cuidado Adecuado</h4>
                        <p>Sigue las instrucciones de limpieza y mantenimiento.</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">📸</span>
                        <h4>Documenta Problemas</h4>
                        <p>Toma fotos claras de cualquier defecto encontrado.</p>
                    </div>
                </div>
            </div>

            <div className="contact-guarantee">
                <h3>¿Necesitas hacer un reclamo de garantía?</h3>
                <p>Nuestro equipo está listo para ayudarte</p>
                <div className="contact-buttons">
                    <a href="/contacto" className="btn-primary">Formulario de Reclamo</a>
                    <a href="mailto:garantia@tienda.com" className="btn-secondary">garantia@tienda.com</a>
                </div>
            </div>
        </div>
    );
};

export default Garantia;
