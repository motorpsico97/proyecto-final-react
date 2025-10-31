import { useEffect, useState } from 'react';
import '../styles/CentroAyuda.css';

const CentroAyuda = () => {
    const [activeQuestion, setActiveQuestion] = useState(null);

    useEffect(() => {
        document.title = 'Centro de Ayuda | Shoes Store';
    }, []);

    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    const faqs = [
        {
            categoria: "Pedidos",
            preguntas: [
                {
                    pregunta: "¿Cómo puedo hacer un pedido?",
                    respuesta: "Navega por nuestro catálogo, selecciona los productos que deseas, elige la talla y cantidad, y agrégalos al carrito. Luego ve al carrito y completa el proceso de checkout con tus datos."
                },
                {
                    pregunta: "¿Puedo modificar mi pedido después de realizarlo?",
                    respuesta: "Puedes modificar tu pedido dentro de las primeras 2 horas después de realizarlo. Contáctanos inmediatamente a través de nuestro formulario de contacto o por teléfono."
                },
                {
                    pregunta: "¿Cómo puedo rastrear mi pedido?",
                    respuesta: "Recibirás un email con el número de seguimiento una vez que tu pedido sea despachado. Puedes usar ese número en la página del transportista para rastrear tu envío."
                }
            ]
        },
        {
            categoria: "Pagos",
            preguntas: [
                {
                    pregunta: "¿Qué métodos de pago aceptan?",
                    respuesta: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal y transferencia bancaria. Todos los pagos son procesados de forma segura."
                },
                {
                    pregunta: "¿Es seguro comprar en su sitio?",
                    respuesta: "Sí, utilizamos encriptación SSL de 256 bits para proteger toda la información de pago. Nunca almacenamos datos completos de tarjetas en nuestros servidores."
                },
                {
                    pregunta: "¿Puedo pagar en cuotas?",
                    respuesta: "Sí, ofrecemos planes de pago en cuotas con tarjetas de crédito seleccionadas. Las opciones disponibles se mostrarán durante el proceso de checkout."
                }
            ]
        },
        {
            categoria: "Envíos",
            preguntas: [
                {
                    pregunta: "¿Cuánto tiempo tarda el envío?",
                    respuesta: "Los envíos dentro de Montevideo tardan 24-48 horas. Envíos al interior de Uruguay tardan 3-5 días hábiles. Envíos internacionales pueden tardar 7-15 días hábiles."
                },
                {
                    pregunta: "¿Cuál es el costo de envío?",
                    respuesta: "El costo de envío varía según la ubicación y el peso del pedido. Envíos gratuitos para compras superiores a $2000. El costo exacto se calculará durante el checkout."
                },
                {
                    pregunta: "¿Hacen envíos internacionales?",
                    respuesta: "Sí, realizamos envíos a la mayoría de países de América del Sur. Los costos y tiempos varían según el destino. Contacta con nosotros para más información."
                }
            ]
        },
        {
            categoria: "Devoluciones",
            preguntas: [
                {
                    pregunta: "¿Cuál es la política de devoluciones?",
                    respuesta: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Los productos deben estar sin usar, con etiquetas originales y en su empaque original."
                },
                {
                    pregunta: "¿Cómo inicio una devolución?",
                    respuesta: "Contáctanos a través del formulario de contacto o por email indicando tu número de pedido y el motivo de la devolución. Te enviaremos las instrucciones."
                },
                {
                    pregunta: "¿Cuándo recibiré mi reembolso?",
                    respuesta: "Una vez que recibamos y verifiquemos el producto devuelto, procesaremos el reembolso en 5-7 días hábiles. El dinero aparecerá en tu cuenta según los tiempos de tu banco."
                }
            ]
        },
        {
            categoria: "Productos",
            preguntas: [
                {
                    pregunta: "¿Cómo sé qué talla elegir?",
                    respuesta: "Cada producto tiene una guía de tallas disponible en la página de detalles. Si tienes dudas, contáctanos y te ayudaremos a encontrar la talla perfecta."
                },
                {
                    pregunta: "¿Los productos son originales?",
                    respuesta: "Sí, todos nuestros productos son 100% originales y auténticos. Trabajamos directamente con las marcas oficiales y distribuidores autorizados."
                },
                {
                    pregunta: "¿Puedo reservar un producto?",
                    respuesta: "Actualmente no ofrecemos servicio de reserva. Te recomendamos completar tu compra lo antes posible para asegurar la disponibilidad del producto."
                }
            ]
        }
    ];

    return (
        <div className="centro-ayuda-container">
            <div className="centro-ayuda-header">
                <h1>Centro de Ayuda</h1>
                <p>Encuentra respuestas a las preguntas más frecuentes</p>
            </div>

            {/* Barra de búsqueda eliminada según solicitud */}

            <div className="faqs-container">
                {faqs.map((categoria, catIndex) => (
                    <div key={catIndex} className="faq-category">
                        <h2 className="category-title">{categoria.categoria}</h2>
                        <div className="questions-list">
                            {categoria.preguntas.map((faq, index) => {
                                const questionIndex = `${catIndex}-${index}`;
                                const isActive = activeQuestion === questionIndex;
                                
                                return (
                                    <div key={index} className={`faq-item ${isActive ? 'active' : ''}`}>
                                        <button 
                                            className="faq-question"
                                            onClick={() => toggleQuestion(questionIndex)}
                                        >
                                            <span>{faq.pregunta}</span>
                                            <svg 
                                                className={`chevron ${isActive ? 'rotate' : ''}`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isActive && (
                                            <div className="faq-answer">
                                                <p>{faq.respuesta}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="contact-cta">
                <h3>¿No encuentras lo que buscas?</h3>
                <p>Nuestro equipo de soporte está aquí para ayudarte</p>
                <div className="cta-buttons">
                    <a href="/contacto" className="cta-button primary">Contáctanos</a>
                    <a href="tel:+59899123456" className="cta-button secondary">Llámanos</a>
                </div>
            </div>
        </div>
    );
};

export default CentroAyuda;
