import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

/**
 * Componente SearchBar - Barra de búsqueda inteligente
 * 
 * Este componente proporciona una interfaz de búsqueda que permite a los usuarios
 * buscar productos por nombre, marca, categoría, etc.
 * 
 * Características principales:
 * - Búsqueda en tiempo real con navegación por URL
 * - Botón de limpieza para restablecer resultados
 * - Manejo de estado de búsqueda con React Router
 * - Interfaz responsiva y accesible
 * - Codificación URL segura para términos de búsqueda
 */
const SearchBar = () => {
    // Estado para manejar el término de búsqueda actual
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Hook para navegación programática

    /**
     * Manejador de envío del formulario de búsqueda
     * Navega a la página principal con el término de búsqueda como parámetro URL
     * 
     * @param {Event} e - Evento de envío del formulario
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Navegar a la página principal con el término de búsqueda como parámetro
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        // Navegar a la página principal sin parámetros de búsqueda
        navigate('/');
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="clear-search-btn"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        ×
                    </button>
                )}
                <button
                    type="submit"
                    className="search-submit-btn"
                    aria-label="Buscar"
                >
                    <svg
                        className="search-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;