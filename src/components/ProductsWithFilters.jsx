import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductFilters from './ProductFilters';
import ItemList from './ItemList';
import '../styles/ProductsWithFilters.css';

const ProductsWithFilters = () => {
    const { categoryId, marca, genero } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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
            price: { min: 0, max: 10000 }
        };
        setFilters(newFilters);
    }, [categoryId, marca, genero]);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...products];

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
    }, [filters, products]);

    const handleFiltersChange = (newFilters) => {
        // Mantener los filtros de URL si existen
        const updatedFilters = {
            ...newFilters,
            categories: categoryId ? [decodeURIComponent(categoryId)] : newFilters.categories,
            marcas: marca ? [decodeURIComponent(marca)] : newFilters.marcas,
            generos: genero ? [decodeURIComponent(genero)] : newFilters.generos,
        };
        setFilters(updatedFilters);
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
                            {categoryId ? decodeURIComponent(categoryId) : 
                             marca ? decodeURIComponent(marca) : 
                             genero ? decodeURIComponent(genero) : 
                             'Productos'} ({filteredProducts.length})
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