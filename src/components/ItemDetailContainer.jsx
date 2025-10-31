import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ItemDetail from './ItemDetail';
import '../styles/ItemDetail.css';

const ItemDetailContainer = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);

        const docRef = doc(db, 'items', id);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setProduct({ id: doc.id, ...doc.data() });
                } else {
                    console.log("No existe el producto");
                }
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (loading) return;
        if (product && (product.title || product.nombre || product.name)) {
            const name = product.title || product.nombre || product.name;
            document.title = `${name} | Shoes Store`;
        } else {
            document.title = 'Producto | Shoes Store';
        }
    }, [loading, product]);

    if (loading) {
        return <div className="loading-message">Cargando producto...</div>;
    }

    if (!product) {
        document.title = 'Producto no encontrado | Shoes Store';
        return <div className="empty-message">Producto no encontrado</div>;
    }

    return (
        <div className="item-detail-container">
            <ItemDetail product={product} />
        </div>
    );
};

export default ItemDetailContainer;