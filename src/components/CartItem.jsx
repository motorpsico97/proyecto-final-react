import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartItem.css';

/** CartItem - Representa un producto individual en el carrito de compras. Permite modificar cantidad, mostrar información del producto y eliminarlo del carrito */
const CartItem = ({ item }) => {
    // Extraemos las funciones del contexto del carrito para manipular items
    const { removeItem, updateItemStockWithStock, updateItemStock } = useCart();

    // Estado local para manejar errores de validación de stock
    const [error, setError] = useState('');

    /** Función para decrementar la cantidad del producto en el carrito. Reduce en 1 la cantidad sin validación de stock mínimo*/
    const decrement = () => {
        setError(''); // Limpia errores previos
        const newStock = item.stock - 1;
        updateItemStock(item.id, newStock, item.talle);
    };

    /**
     * Función para incrementar la cantidad del producto en el carrito
     * Valida que haya stock disponible antes de incrementar
     */
    const increment = async () => {
        setError('');
        const newStock = item.stock + 1;
        // Valida stock disponible con la base de datos
        const res = await updateItemStockWithStock(item.id, newStock, item.talle);
        if (!res.success) setError(res.message || 'No se pudo actualizar la cantidad');
    };

    return (
        <div className="cart-item">
            <div className="cart-item-info">
                <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                />
                {/* Detalles del producto y controles */}
                <div className="cart-item-details">
                    <h3>{item.title}</h3>

                    {/* Talle seleccionado (solo si existe) */}
                    {item.talle && <p className="cart-item-size">Talle: {item.talle}</p>}

                    <p className='unit-price'>Precio unitario: ${item.price}</p>

                    {/* Subtotal calculado (precio × cantidad) */}
                    <p className="cart-item-price">Subtotal: ${item.price * item.stock}</p>

                    {/* Controles para modificar la cantidad */}
                    <div className="quantity-controls">
                        <button onClick={decrement} className="qty-button">-</button>
                        <div className="qty-number">{item.stock}</div>
                        <button onClick={increment} className="qty-button">+</button>
                    </div>

                    {/* Mensaje de error si hay problemas con el stock */}
                    {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                </div>
            </div>

            {/* Botón para eliminar completamente el item del carrito */}
            <button
                onClick={() => removeItem(item.id, item.talle)}
                className="remove-button"
            >
                Eliminar
            </button>
        </div>
    );
};

export default CartItem;