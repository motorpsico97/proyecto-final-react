import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Error404.css';    

const Error404 = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = '404 - Página no encontrada | Shoes Store';
    }, []);

    const goHome = () => {
        navigate('/');
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="error-404-container">
            <div className="error-content">
                <div className="error-header">
                    <h1 className="error-title">404</h1>
                    <h2 className="error-subtitle">¡Oops! Página no encontrada</h2>
                </div>
                
                <div className="error-message">
                    <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                    <div className="error-path">
                        Ruta solicitada: <code>{location.pathname}</code>
                    </div>
                </div>

                <div className="error-actions">
                    <button onClick={goHome} className="btn btn-primary">
                        <i className="icon-home"></i>
                        Ir al Inicio
                    </button>
                    <button onClick={goBack} className="btn btn-secondary">
                        <i className="icon-back"></i>
                        Volver Atrás
                    </button>
                </div>

                <div className="error-suggestions">
                    <h3>¿Qué puedes hacer?</h3>
                    <ul>
                        <li>Verificar que la URL esté escrita correctamente</li>
                        <li>Ir a la <button onClick={goHome} className="link-button">página principal</button></li>
                        <li>Usar el menú de navegación para encontrar lo que buscas</li>
                        <li>Contactarnos si crees que esto es un error</li>
                    </ul>
                </div>

                <div className="error-illustration">
                    <div className="illustration-404">
                        <div className="number">4</div>
                        <div className="circle">
                            <div className="face">
                                <div className="eyes">
                                    <div className="eye"></div>
                                    <div className="eye"></div>
                                </div>
                                <div className="mouth"></div>
                            </div>
                        </div>
                        <div className="number">4</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404;