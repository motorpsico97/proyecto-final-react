import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../styles/Contact.css';

const Contact = () => {
    useEffect(() => {
        document.title = 'Contacto | Shoes Store';
    }, []);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (formData.telefono && !/^\d{9,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'El teléfono debe tener entre 9 y 15 dígitos';
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es obligatorio';
        } else if (formData.mensaje.trim().length < 10) {
            newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            // Guardar el formulario en Firebase Firestore
            const contactData = {
                nombre: formData.nombre.trim(),
                email: formData.email.trim(),
                telefono: formData.telefono.trim() || null,
                mensaje: formData.mensaje.trim(),
                fecha: new Date().toISOString(),
            };

            await addDoc(collection(db, 'form-contact'), contactData);

            // Mostrar mensaje de éxito
            setSubmitted(true);

            // Resetear formulario
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: ''
            });

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1>Contacto</h1>
                <p>¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.</p>
            </div>

            {submitted && (
                <div className="success-message">
                    ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
                </div>
            )}

            <div className="contact-content">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo *</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? 'error' : ''}
                            placeholder="Tu nombre"
                        />
                        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="tu@email.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono (opcional)</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={errors.telefono ? 'error' : ''}
                            placeholder="+598 99 123 456"
                        />
                        {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="mensaje">Mensaje *</label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            value={formData.mensaje}
                            onChange={handleChange}
                            className={errors.mensaje ? 'error' : ''}
                            placeholder="Escribe tu mensaje aquí..."
                            rows="6"
                        />
                        {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
                    </div>
                    <p>* Campos obligatorios</p>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                </form>

                <div className="contact-info">
                    <h2>Información de contacto</h2>

                    <div className="info-item info-item-map">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="info-item-content">
                            <h3>Dirección</h3>
                            <p>Estadio Centenario<br />Montevideo, Uruguay</p>
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.0479829448195!2d-56.15826492346756!3d-34.894172873009384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f8027ad7f7a09%3A0x6d80d0c0865e1e36!2sEstadio%20Centenario!5e0!3m2!1ses!2suy!4v1730224800000!5m2!1ses!2suy"
                                    width="100%"
                                    height="250"
                                    style={{ border: 0, borderRadius: '8px', marginTop: '0.75rem' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Mapa de ubicación - Estadio Centenario"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="info-item">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <h3>Email</h3>
                            <p>info@tienda.com<br />soporte@tienda.com</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                            <h3>Teléfono</h3>
                            <p>+598 1234 5678<br />Lun - Vie: 9:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
