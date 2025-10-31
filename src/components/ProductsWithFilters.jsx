import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductFilters from './ProductFilters';
import ItemList from './ItemList';
import '../styles/ProductsWithFilters.css';

const ProductsWithFilters = () => {
    const { categoryId, marca, genero } = useParams();
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [filters, setFilters] = useState({
        categories: [],
        marcas: [],
        generos: [],
        price: { min: 0, max: 10000 }
    });

    // Obtener todos los productos
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const itemsRef = collection(db, 'items');
                const snapshot = await getDocs(itemsRef);
                const allProducts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Calcular rango de precios dinámico
                const prices = allProducts.map(item => Number(item.price) || 0).filter(price => price > 0);
                if (prices.length > 0) {
                    const dynamicRange = {
                        min: Math.min(...prices),
                        max: Math.max(...prices)
                    };
                    setPriceRange(dynamicRange);
                    
                    // Actualizar filtros con el rango dinámico
                    setFilters(prevFilters => ({
                        ...prevFilters,
                        price: dynamicRange
                    }));
                }

                setProducts(allProducts);
                setFilteredProducts(allProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Configurar filtros basándose en los parámetros de la URL
    useEffect(() => {
        const newFilters = {
            categories: categoryId ? [decodeURIComponent(categoryId)] : [],
            marcas: marca ? [decodeURIComponent(marca)] : [],
            generos: genero ? [decodeURIComponent(genero)] : [],
            price: priceRange
        };
        setFilters(newFilters);
    }, [categoryId, marca, genero, priceRange]);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...products];

            // Filtrar por búsqueda de texto
            if (searchTerm) {
                const searchTermNormalized = searchTerm
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
                
                filtered = filtered.filter(product => {
                    const searchFields = [
                        product.name,
                        product.description,
                        product.categoryId,
                        product.marca,
                        product.genero,
                        product.color,
                        product.material,
                        product.tags
                    ].filter(Boolean); // Filtrar campos que existan
                    
                    return searchFields.some(field => {
                        const fieldNormalized = String(field)
                            .toLowerCase()
                            .trim()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
                        
                        return fieldNormalized.includes(searchTermNormalized);
                    });
                });
            }

            // Filtrar por categorías
            if (filters.categories.length > 0) {
                filtered = filtered.filter(product =>
                    filters.categories.includes(product.categoryId)
                );
            }

            // Filtrar por marcas
            if (filters.marcas.length > 0) {
                filtered = filtered.filter(product =>
                    filters.marcas.includes(product.marca)
                );
            }

            // Filtrar por géneros
            if (filters.generos.length > 0) {
                filtered = filtered.filter(product =>
                    filters.generos.includes(product.genero)
                );
            }

            // Filtrar por precio
            filtered = filtered.filter(product => {
                const price = Number(product.price) || 0;
                return price >= filters.price.min && price <= filters.price.max;
            });

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [filters, products, searchTerm]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return (
            <div className="products-container">
                <div className="loading-message">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="products-layout">
                <ProductFilters
                    onFiltersChange={handleFiltersChange}
                    activeFilters={filters}
                />
                <div className="products-main">
                    <div className="products-header">
                        <h2>
                            {searchTerm ? `Resultados para: "${searchTerm}"` :
                                categoryId ? decodeURIComponent(categoryId) :
                                    marca ? decodeURIComponent(marca) :
                                        genero ? decodeURIComponent(genero) :
                                            'Nuestros Productos'} 
                        </h2>
                        {filteredProducts.length !== products.length && (
                            <p className="filter-results">
                                Mostrando {filteredProducts.length} de {products.length} productos
                            </p>
                        )}
                    </div>
                    {filteredProducts.length > 0 ? (
                        <ItemList products={filteredProducts} />
                    ) : (
                        <div className="no-products-found">
                            <h3>No se encontraron productos</h3>
                            <p>Intenta ajustar los filtros para ver más resultados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsWithFilters;