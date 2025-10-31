import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../styles/ProductFilters.css';

const ProductFilters = ({ onFiltersChange, activeFilters }) => {
    const [categories, setCategories] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [loading, setLoading] = useState(true);

    // Función para obtener valores únicos
    const getUniqueValues = (items, field) => {
        const values = items
            .map(item => item[field])
            .filter(value => value && value.trim() !== '')
            .map(value => value.trim());
        return [...new Set(values)].sort();
    };

    // Obtener datos de Firebase
    useEffect(() => {
        const fetchFiltersData = async () => {
            setLoading(true);
            try {
                const itemsRef = collection(db, 'items');
                const snapshot = await getDocs(itemsRef);
                const items = snapshot.docs.map(doc => doc.data());

                // Extraer valores únicos
                const uniqueCategories = getUniqueValues(items, 'categoryId');
                const uniqueMarcas = getUniqueValues(items, 'marca');
                const uniqueGeneros = getUniqueValues(items, 'genero');

                // Encontrar rango de precios
                const prices = items.map(item => Number(item.price) || 0).filter(price => price > 0);
                if (prices.length > 0) {
                    setPriceRange({
                        min: Math.min(...prices),
                        max: Math.max(...prices)
                    });
                }

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
        onFiltersChange({
            ...activeFilters,
            price: {
                ...activeFilters.price,
                [field]: Number(value)
            }
        });
    };

    // Limpiar todos los filtros
    const clearAllFilters = () => {
        onFiltersChange({
            categories: [],
            marcas: [],
            generos: [],
            price: { min: priceRange.min, max: priceRange.max }
        });
    };

    // Remover filtro específico
    const removeFilter = (filterType, value) => {
        let newFilters = { ...activeFilters };
        
        switch (filterType) {
            case 'categories':
                newFilters.categories = activeFilters.categories.filter(c => c !== value);
                break;
            case 'marcas':
                newFilters.marcas = activeFilters.marcas.filter(m => m !== value);
                break;
            case 'generos':
                newFilters.generos = activeFilters.generos.filter(g => g !== value);
                break;
            case 'price':
                newFilters.price = { min: priceRange.min, max: priceRange.max };
                break;
            default:
                break;
        }
        
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

    return (
        <aside className="product-filters">
            <div className="filters-header">
                <h3>Filtros</h3>
                <button 
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
                >
                    Limpiar todo
                </button>
            </div>

            {/* Filtro por Categorías */}
            <div className="filter-section">
                <h4 className="filter-title">Categorías</h4>
                <div className="filter-options">
                    {categories.map(category => (
                        <label key={category} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por Marcas */}
            <div className="filter-section">
                <h4 className="filter-title">Marcas</h4>
                <div className="filter-options">
                    {marcas.map(marca => (
                        <label key={marca} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.marcas.includes(marca)}
                                onChange={() => handleMarcaChange(marca)}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{marca}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por Género */}
            <div className="filter-section">
                <h4 className="filter-title">Género</h4>
                <div className="filter-options">
                    {generos.map(genero => (
                        <label key={genero} className="filter-option">
                            <input
                                type="checkbox"
                                checked={activeFilters.generos.includes(genero)}
                                onChange={() => handleGeneroChange(genero)}
                            />
                            <span className="checkmark"></span>
                            <span className="option-text">{genero}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por Precio */}
            <div className="filter-section">
                <h4 className="filter-title">Precio</h4>
                <div className="price-filter">
                    <div className="price-range-display">
                        ${activeFilters.price.min} - ${activeFilters.price.max}
                    </div>
                    <div className="price-slider-container">
                        <div className="slider-group">
                            <label className="slider-label">Mínimo</label>
                            <input
                                type="range"
                                className="price-slider price-slider-min"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={activeFilters.price.min}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                            />
                        </div>
                        <div className="slider-group">
                            <label className="slider-label">Máximo</label>
                            <input
                                type="range"
                                className="price-slider price-slider-max"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={activeFilters.price.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros activos */}
            <div className="active-filters-section">
                <h4 className="active-filters-title">Filtros Activos</h4>
                <div className="active-filters-list">
                    {/* Filtros de categorías */}
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
                    
                    {/* Filtros de marcas */}
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
                    
                    {/* Filtros de géneros */}
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
                    
                    {/* Filtro de precio (solo si no es el rango por defecto) */}
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
                    
                    {/* Mensaje cuando no hay filtros */}
                    {activeFilters.categories.length === 0 && 
                     activeFilters.marcas.length === 0 && 
                     activeFilters.generos.length === 0 && 
                     activeFilters.price.min === priceRange.min && 
                     activeFilters.price.max === priceRange.max && (
                        <p className="no-active-filters">No hay filtros aplicados</p>
                    )}
                </div>
                
                {/* Contador total */}
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