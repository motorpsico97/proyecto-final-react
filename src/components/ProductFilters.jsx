import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../styles/ProductFilters.css';

/** Sistema de filtrado avanzado para productos. Este componente proporciona una interfaz completa de filtrado que permite a los usuarios filtrar productos por múltiples criterios*/


const ProductFilters = ({ onFiltersChange, activeFilters }) => {
    // Estados del componente para manejar los datos de filtrado
    const [categories, setCategories] = useState([]); // Lista de categorías únicas disponibles
    const [marcas, setMarcas] = useState([]); // Lista de marcas únicas disponibles
    const [generos, setGeneros] = useState([]); // Lista de géneros únicos disponibles
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 }); // Rango de precios min/max
    const [loading, setLoading] = useState(true); // Estado de carga durante la obtención de datos


    // Función para obtener valores únicos
    const getUniqueValues = (items, field) => {
        const values = items
            .map(item => item[field])
            .filter(value => value && value.trim() !== '')
            .map(value => value.trim());
        return [...new Set(values)].sort();
    };

    /** Obtiene todos los productos de Firebase y extrae datos únicos para los filtros. Calcula el rango de precios disponible automáticamente
     */
    useEffect(() => {
        const fetchFiltersData = async () => {
            setLoading(true);
            try {
                // Obtiene todos los productos de la colección 'items' en Firebase
                const itemsRef = collection(db, 'items');
                const snapshot = await getDocs(itemsRef);
                const items = snapshot.docs.map(doc => doc.data());

                // Extrae listas únicas de categorías, marcas y géneros
                const uniqueCategories = getUniqueValues(items, 'categoryId');
                const uniqueMarcas = getUniqueValues(items, 'marca');
                const uniqueGeneros = getUniqueValues(items, 'genero');

                // Calcula el rango de precios disponible (min y max)
                const prices = items.map(item => Number(item.price) || 0).filter(price => price > 0);
                if (prices.length > 0) {
                    setPriceRange({
                        min: Math.min(...prices), // Precio mínimo
                        max: Math.max(...prices)  // Precio máximo
                    });
                }

                // Actualiza todos los estados con los datos obtenidos
                setCategories(uniqueCategories);
                setMarcas(uniqueMarcas);
                setGeneros(uniqueGeneros);
            } catch (error) {
                console.error('Error fetching filters data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiltersData();
    }, []);

    // Manejar cambios en filtros de categoría
    const handleCategoryChange = (category) => {
        // Si la categoría ya está seleccionada, la remueve; si no, la agrega
        const newCategories = activeFilters.categories.includes(category)
            ? activeFilters.categories.filter(c => c !== category)
            : [...activeFilters.categories, category];

        onFiltersChange({
            ...activeFilters,
            categories: newCategories
        });
    };

    // Manejar cambios en filtros de marca
    const handleMarcaChange = (marca) => {
        // Si la marca ya está seleccionada, la remueve; si no, la agrega
        const newMarcas = activeFilters.marcas.includes(marca)
            ? activeFilters.marcas.filter(m => m !== marca)
            : [...activeFilters.marcas, marca];

        onFiltersChange({
            ...activeFilters,
            marcas: newMarcas
        });
    };


    // Manejar cambios en filtros de género
    const handleGeneroChange = (genero) => {
        // Si el género ya está seleccionado, lo remueve; si no, lo agrega
        const newGeneros = activeFilters.generos.includes(genero)
            ? activeFilters.generos.filter(g => g !== genero)
            : [...activeFilters.generos, genero];

        onFiltersChange({
            ...activeFilters,
            generos: newGeneros
        });
    };


    // Manejar cambios en filtros de precio
    const handlePriceChange = (field, value) => {
        // Actualiza el campo especificado (min o max) del rango de precios
        onFiltersChange({
            ...activeFilters,
            price: {
                ...activeFilters.price,
                [field]: Number(value) // Convierte a número el valor del slider
            }
        });
    };

    /**Función para limpiar todos los filtros aplicados     */

    // Limpiar todos los filtros
    const clearAllFilters = () => {
        // Restablece todos los filtros a arrays vacíos y rango de precios completo
        onFiltersChange({
            categories: [],
            marcas: [],
            generos: [],
            price: { min: priceRange.min, max: priceRange.max }
        });
    };


    // Remover filtro específico
    const removeFilter = (filterType, value) => {
        let newFilters = { ...activeFilters }; // Copia los filtros actuales

        // Switch para manejar diferentes tipos de filtros
        switch (filterType) {
            case 'categories':
                // Remueve la categoría específica del array
                newFilters.categories = activeFilters.categories.filter(c => c !== value);
                break;
            case 'marcas':
                // Remueve la marca específica del array
                newFilters.marcas = activeFilters.marcas.filter(m => m !== value);
                break;
            case 'generos':
                // Remueve el género específico del array
                newFilters.generos = activeFilters.generos.filter(g => g !== value);
                break;
            case 'price':
                // Restablece el rango de precios al completo
                newFilters.price = { min: priceRange.min, max: priceRange.max };
                break;
            default:
                break;
        }

        // Aplica los cambios notificando al componente padre
        onFiltersChange(newFilters);
    };

    if (loading) {
        return (
            <aside className="product-filters">
                <div className="filters-loading">
                    Cargando filtros... 
                </div>
            </aside>
        );
    }

    // Renderizado principal del componente
    return (
        <aside className="product-filters">
            {/* Encabezado de filtros con botón de limpieza */}
            <div className="filters-header">
                <h3>Filtros</h3>
                <button
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
                    title="Eliminar todos los filtros aplicados"
                >
                    Limpiar todo
                </button>
            </div>

            {/* Sección de filtro por Categorías */}
            <div className="filter-section">
                <h4 className="filter-title">Categorías</h4>
                <div className="filter-options">
                    {categories.map(category => (
                        <label key={category} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                aria-label={`Filtrar por categoría ${category}`}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sección de filtro por Marcas */}
            <div className="filter-section">
                <h4 className="filter-title">Marcas</h4>
                <div className="filter-options">
                    {marcas.map(marca => (
                        <label key={marca} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.marcas.includes(marca)}
                                onChange={() => handleMarcaChange(marca)}
                                aria-label={`Filtrar por marca ${marca}`}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{marca}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sección de filtro por Género */}
            <div className="filter-section">
                <h4 className="filter-title">Género</h4>
                <div className="filter-options">
                    {generos.map(genero => (
                        <label key={genero} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.generos.includes(genero)}
                                onChange={() => handleGeneroChange(genero)}
                                aria-label={`Filtrar por género ${genero}`}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{genero}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sección de filtro por Precio con sliders interactivos */}
            <div className="filter-section">
                <h4 className="filter-title">Precio</h4>
                <div className="price-filter">
                    {/* Muestra el rango de precios seleccionado */}
                    <div className="price-range-display">
                        ${activeFilters.price.min} - ${activeFilters.price.max}
                    </div>
                    {/* Contenedor de sliders para min y max */}
                    <div className="price-slider-container">
                        {/* Slider para precio mínimo */}
                        <div className="slider-group">
                            <label className="slider-label">Mínimo</label>
                            <input
                                type="range"
                                className="price-slider price-slider-min"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={activeFilters.price.min}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                                aria-label="Precio mínimo"
                            />
                        </div>
                        {/* Slider para precio máximo */}
                        <div className="slider-group">
                            <label className="slider-label">Máximo</label>
                            <input
                                type="range"
                                className="price-slider price-slider-max"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={activeFilters.price.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                aria-label="Precio máximo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de filtros activos con chips removibles */}
            <div className="active-filters-section">
                <h4 className="active-filters-title">Filtros Activos</h4>
                <div className="active-filters-list">
                    {/* Chips de filtros de categorías */}
                    {activeFilters.categories.map(category => (
                        <div key={`category-${category}`} className="active-filter-chip">
                            <span className="filter-value">{category}</span>
                            <button
                                onClick={() => removeFilter('categories', category)}
                                className="remove-filter-btn"
                                aria-label={`Eliminar filtro ${category}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* Chips de filtros de marcas */}
                    {activeFilters.marcas.map(marca => (
                        <div key={`marca-${marca}`} className="active-filter-chip">
                            <span className="filter-value">{marca}</span>
                            <button
                                onClick={() => removeFilter('marcas', marca)}
                                className="remove-filter-btn"
                                aria-label={`Eliminar filtro ${marca}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* Chips de filtros de géneros */}
                    {activeFilters.generos.map(genero => (
                        <div key={`genero-${genero}`} className="active-filter-chip">
                            <span className="filter-value">{genero}</span>
                            <button
                                onClick={() => removeFilter('generos', genero)}
                                className="remove-filter-btn"
                                aria-label={`Eliminar filtro ${genero}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* Chip de filtro de precio (solo si no es el rango por defecto) */}
                    {(activeFilters.price.min > priceRange.min || activeFilters.price.max < priceRange.max) && (
                        <div className="active-filter-chip">
                            <span className="filter-value">
                                ${activeFilters.price.min} - ${activeFilters.price.max}
                            </span>
                            <button
                                onClick={() => removeFilter('price', null)}
                                className="remove-filter-btn"
                                aria-label="Eliminar filtro de precio"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Mensaje cuando no hay filtros aplicados */}
                    {activeFilters.categories.length === 0 &&
                        activeFilters.marcas.length === 0 &&
                        activeFilters.generos.length === 0 &&
                        activeFilters.price.min === priceRange.min &&
                        activeFilters.price.max === priceRange.max && (
                            <p className="no-active-filters">No hay filtros aplicados</p>
                        )}
                </div>

                {/* Contador de filtros activos */}
                {(activeFilters.categories.length + activeFilters.marcas.length + activeFilters.generos.length > 0 ||
                    activeFilters.price.min > priceRange.min || activeFilters.price.max < priceRange.max) && (
                        <div className="active-filters-count">
                            <span>
                                {activeFilters.categories.length + activeFilters.marcas.length + activeFilters.generos.length +
                                    (activeFilters.price.min > priceRange.min || activeFilters.price.max < priceRange.max ? 1 : 0)} filtros activos
                            </span>
                        </div>
                    )}
            </div>
        </aside>
    );
};

export default ProductFilters;
