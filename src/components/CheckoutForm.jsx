import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutForm.css';

/** * Función para calcular el stock total de un talle específico, donde cada talle puede tener stock distribuido por locales */
const calculateTalleStock = (talleData) => {
    if (!talleData || typeof talleData !== 'object') return 0;

    // Si talleData tiene una propiedad 'stock' que es un objeto con stock por local
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

/** Función  para calcular el stock total de todos los talles de un producto. Suma el stock disponible de todos los talles */
const calculateTotalStock = (talles) => {
    if (!talles || typeof talles !== 'object') return 0;
    return Object.values(talles).reduce((total, talleData) => {
        return total + calculateTalleStock(talleData);
    }, 0);
};

/** Formulario de checkout para finalizar compras. Valida datos del cliente, verificación de stock y creación de órdenes
 * Actualiza el stock de productos después de una compra exitosa. */
const CheckoutForm = () => {
    // Establecer título de página al cargar el componente
    useEffect(() => {
        document.title = 'Checkout | Shoes Store';
    }, []);

    // Estados del componente
    const [orderId, setOrderId] = useState(''); // ID de la orden creada (éxito)
    const [loading, setLoading] = useState(false); // Estado de carga durante el procesamiento

    // Contexto del carrito y navegación
    const { cart, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    // Estado del formulario con datos del cliente
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        confirmEmail: ''
    });

    /**
     * Función para actualizar el stock de un producto en Firebase después de una compra.F Maneja tanto productos con talles como sin talles, y la distribución por locales */
    const updateProductStock = async (productId, quantityToBuy, talle = null) => {
        const productRef = doc(db, 'items', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const data = productSnap.data();

            // Manejo de productos con estructura de talles y stock por locales
            if (talle && data.talles && data.talles[talle]) {
                const talleData = data.talles[talle];

                // Si el talle tiene stock distribuido por locales
                if (talleData.stock && typeof talleData.stock === 'object') {
                    const updatedStock = { ...talleData.stock };
                    let remainingToBuy = quantityToBuy;

                    // Decrementar stock de cada local hasta completar la cantidad comprada
                    for (const [local, stock] of Object.entries(updatedStock)) {
                        if (remainingToBuy <= 0) break;

                        const currentStock = typeof stock === 'number' ? stock : 0;
                        const toDecrease = Math.min(currentStock, remainingToBuy);
                        updatedStock[local] = currentStock - toDecrease;
                        remainingToBuy -= toDecrease;
                    }

                    // Actualizar el stock en Firebase para el talle específico
                    await updateDoc(productRef, {
                        [`talles.${talle}.stock`]: updatedStock
                    });
                }
            } else {
                // Fallback para productos sin estructura de talles (formato legacy)
                const currentStock = data.stock || 0;
                await updateDoc(productRef, {
                    stock: Math.max(0, currentStock - quantityToBuy)
                });
            }
        }
    };

    /** Función principal para manejar el envío del formulario de checkout. Valida datos, verifica stock disponible, crea la orden y actualiza inventario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de confirmación de email
        if (formData.email !== formData.confirmEmail) {
            alert('Los emails no coinciden');
            return;
        }

        setLoading(true);

        try {
            // PASO 1: Verificar que todos los productos tengan stock suficiente
            for (const item of cart) {
                const productRef = doc(db, 'items', item.id);
                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) {
                    throw new Error(`Producto ${item.title} no encontrado`);
                }

                const data = productSnap.data();
                let availableStock = 0;

                // Calcular stock disponible según la estructura del producto
                if (item.talle && data.talles && data.talles[item.talle]) {
                    availableStock = calculateTalleStock(data.talles[item.talle]);
                } else if (data.talles) {
                    availableStock = calculateTotalStock(data.talles);
                } else {
                    availableStock = typeof data.stock === 'number' ? data.stock : 0;
                }

                // Validar que hay stock suficiente para la cantidad solicitada
                if (availableStock < item.stock) {
                    throw new Error(`Stock insuficiente para ${item.title}${item.talle ? ` talle ${item.talle}` : ''}`);
                }
            }

            // PASO 2: Crear objeto de orden con datos del cliente y productos
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

            // PASO 3: Guardar la orden en Firebase
            const ordersRef = collection(db, 'orders');
            const docRef = await addDoc(ordersRef, order);

            // PASO 4: Actualizar el stock de cada producto comprado
            await Promise.all(
                cart.map(item => updateProductStock(item.id, item.stock, item.talle))
            );

            // PASO 5: Mostrar éxito y limpiar carrito
            setOrderId(docRef.id);
            clearCart();

        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    /** Funció para manejar cambios en los campos del formulario Actualiza el estado formData con los valores ingresados por el usuario
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Pantalla de carga durante el procesamiento
    if (loading) {
        return <div className="loading-message">Procesando su orden...</div>;
    }

    // Pantalla de éxito cuando se crea la orden
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

    // Formulario de checkout
    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Checkout</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                {/* Campo: Nombre completo */}
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

                {/* Campo: Teléfono */}
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

                {/* Campo: Email */}
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

                {/* Campo: Confirmación de Email */}
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

                {/* Botones de acción */}
                <div className="checkout-buttons">
                    {/* Botón para volver al carrito */}
                    <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="back-button"
                    >
                        Volver al Carrito
                    </button>

                    {/* Botón para finalizar compra */}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;