import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutForm.css';

// Funciones helper para calcular stock con el nuevo formato
const calculateTalleStock = (talleData) => {
    if (!talleData || typeof talleData !== 'object') return 0;
    
    // Si talleData tiene una propiedad 'stock' que es un objeto
    if (talleData.stock && typeof talleData.stock === 'object') {
        return Object.values(talleData.stock).reduce((total, stock) => {
            return total + (typeof stock === 'number' ? stock : 0);
        }, 0);
    }
    
    // Si talleData es directamente un objeto con valores numéricos
    return Object.values(talleData).reduce((total, stock) => {
        return total + (typeof stock === 'number' ? stock : 0);
    }, 0);
};

const calculateTotalStock = (talles) => {
    if (!talles || typeof talles !== 'object') return 0;
    return Object.values(talles).reduce((total, talleData) => {
        return total + calculateTalleStock(talleData);
    }, 0);
};

const CheckoutForm = () => {
    useEffect(() => {
        document.title = 'Checkout | Shoes Store';
    }, []);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const { cart, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        confirmEmail: ''
    });

    const updateProductStock = async (productId, quantityToBuy, talle = null) => {
        const productRef = doc(db, 'items', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
            const data = productSnap.data();
            
            // Nuevo formato: talles como objetos con stock por local
            if (talle && data.talles && data.talles[talle]) {
                const talleData = data.talles[talle];
                
                if (talleData.stock && typeof talleData.stock === 'object') {
                    // Actualizar stock por locales para este talle
                    const updatedStock = { ...talleData.stock };
                    let remainingToBuy = quantityToBuy;
                    
                    // Decrementar stock de cada local hasta completar la cantidad
                    for (const [local, stock] of Object.entries(updatedStock)) {
                        if (remainingToBuy <= 0) break;
                        
                        const currentStock = typeof stock === 'number' ? stock : 0;
                        const toDecrease = Math.min(currentStock, remainingToBuy);
                        updatedStock[local] = currentStock - toDecrease;
                        remainingToBuy -= toDecrease;
                    }
                    
                    // Actualizar en Firebase
                    await updateDoc(productRef, {
                        [`talles.${talle}.stock`]: updatedStock
                    });
                }
            } else {
                // Fallback para productos sin estructura de talles
                const currentStock = data.stock || 0;
                await updateDoc(productRef, {
                    stock: Math.max(0, currentStock - quantityToBuy)
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.email !== formData.confirmEmail) {
            alert('Los emails no coinciden');
            return;
        }

        setLoading(true);

        try {
            // Primero verificamos que todos los productos tengan stock suficiente
            for (const item of cart) {
                const productRef = doc(db, 'items', item.id);
                const productSnap = await getDoc(productRef);
                
                if (!productSnap.exists()) {
                    throw new Error(`Producto ${item.title} no encontrado`);
                }
                
                const data = productSnap.data();
                let availableStock = 0;
                
                // Validar stock según el nuevo formato
                if (item.talle && data.talles && data.talles[item.talle]) {
                    availableStock = calculateTalleStock(data.talles[item.talle]);
                } else if (data.talles) {
                    availableStock = calculateTotalStock(data.talles);
                } else {
                    // Fallback para productos sin estructura de talles
                    availableStock = typeof data.stock === 'number' ? data.stock : 0;
                }
                
                if (availableStock < item.stock) {
                    throw new Error(`Stock insuficiente para ${item.title}${item.talle ? ` talle ${item.talle}` : ''}`);
                }
            }

            const order = {
                buyer: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                },
                items: cart,
                total: getTotalPrice(),
                date: new Date()
            };

            const ordersRef = collection(db, 'orders');
            const docRef = await addDoc(ordersRef, order);

            // Actualizamos el stock de cada producto
            await Promise.all(
                cart.map(item => updateProductStock(item.id, item.stock, item.talle))
            );

            setOrderId(docRef.id);
            clearCart();

        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return <div className="loading-message">Procesando su orden...</div>;
    }

    if (orderId) {
        return (
            <div className="order-success">
                <h2 className="checkout-title">¡Gracias por su compra!</h2>
                <p className="order-number">Su número de orden es: {orderId}</p>
                <button onClick={() => navigate('/')} className="back-button">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Checkout</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label className="form-label">Nombre completo:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Teléfono:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirmar Email:</label>
                    <input
                        type="email"
                        name="confirmEmail"
                        value={formData.confirmEmail}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="checkout-buttons">
                    <button 
                        type="button" 
                        onClick={() => navigate('/cart')}
                        className="back-button"
                    >
                        Volver al Carrito
                    </button>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;