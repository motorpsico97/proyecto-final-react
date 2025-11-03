import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ItemList from './ItemList';
import '../styles/ItemListContainer.css';

const ItemListContainer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [validOptions, setValidOptions] = useState({
        categories: [],
        marcas: [],
        generos: []
    });
    const { categoryId, marca, genero } = useParams();

    useEffect(() => {
        setLoading(true);
        setNotFound(false);

        const fetchProducts = async () => {
            try {
                const productsRef = collection(db, 'items');

                // Primero obtenemos todos los productos para validar las opciones disponibles
                const allSnapshot = await getDocs(productsRef);
                const allDocs = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Extraer valores únicos
                const uniqueCategories = [...new Set(allDocs.map(item => item.categoryId).filter(Boolean))];
                const uniqueMarcas = [...new Set(allDocs.map(item => item.marca).filter(Boolean))];
                const uniqueGeneros = [...new Set(allDocs.map(item => item.genero).filter(Boolean))];

                setValidOptions({
                    categories: uniqueCategories,
                    marcas: uniqueMarcas,
                    generos: uniqueGeneros
                });

                if (categoryId) {
                    const decodedCategory = decodeURIComponent(categoryId);

                    if (!uniqueCategories.includes(decodedCategory)) {
                        setNotFound(true);
                        return;
                    }

                    // Filtrar por categoría
                    const filteredProducts = allDocs.filter(item => item.categoryId === decodedCategory);
                    setProducts(filteredProducts);
                    document.title = `${decodedCategory} | Shoes Store`;
                } else if (marca) {
                    const decodedBrand = decodeURIComponent(marca);

                    if (!uniqueMarcas.includes(decodedBrand)) {
                        setNotFound(true);
                        return;
                    }

                    // Filtrar por marca
                    const filteredProducts = allDocs.filter(item => item.marca === decodedBrand);
                    setProducts(filteredProducts);
                    document.title = `${decodedBrand} | Shoes Store`;
                } else if (genero) {
                    const decodedGender = decodeURIComponent(genero);

                    if (!uniqueGeneros.includes(decodedGender)) {
                        setNotFound(true);
                        return;
                    }

                    // Filtrar por género
                    const filteredProducts = allDocs.filter(item => item.genero === decodedGender);
                    setProducts(filteredProducts);
                    document.title = `${decodedGender} | Shoes Store`;
                } else {
                    // Mostrar todos los productos
                    setProducts(allDocs);
                    document.title = 'Inicio | Shoes Store';
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, marca, genero]);

    if (loading) {
        return <div className="loading-message">Cargando productos...</div>;
    }

    // Si se detectó una ruta inválida, redirigir al Error404
    if (notFound) {
        return <Navigate to="/404" replace />;
    }

    if (products.length === 0) {
        return <div className="empty-message">No hay productos disponibles</div>;
    }

    return (
        <div className="item-list-container">
            <div className="products-section">
                <h2 className="item-list-title">
                    {categoryId ? `${decodeURIComponent(categoryId)}` :
                        marca ? `${decodeURIComponent(marca)}` :
                            genero ? `${decodeURIComponent(genero)}` :
                                'Nuestros productos'}
                </h2>
                <ItemList products={products} />
            </div>
        </div>
    );
};

export default ItemListContainer;