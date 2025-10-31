import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import ItemList from './ItemList';
import '../styles/ItemListContainer.css';

const ItemListContainer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryId, marca, genero } = useParams();

    useEffect(() => {
        setLoading(true);

        const fetchProducts = async () => {
            try {
                const productsRef = collection(db, 'items');
                
                if (categoryId) {
                    // Filtrar por categoría
                    const q = query(productsRef, where('categoryId', '==', categoryId));
                    const snapshot = await getDocs(q);
                    const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setProducts(productsData);
                    document.title = `${categoryId} | Shoes Store`;
                } else if (marca) {
                    // Filtrar por marca
                    const q = query(productsRef, where('marca', '==', marca));
                    const snapshot = await getDocs(q);
                    const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setProducts(productsData);
                    document.title = `${marca} | Shoes Store`;
                } else if (genero) {
                    // Filtrar por género
                    const q = query(productsRef, where('genero', '==', genero));
                    const snapshot = await getDocs(q);
                    const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setProducts(productsData);
                    document.title = `${genero} | Shoes Store`;
                } else {
                    // Mostrar todos los productos
                    const snapshot = await getDocs(productsRef);
                    const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setProducts(productsData);
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