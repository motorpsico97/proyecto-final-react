import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartItem.css';

const CartItem = ({ item }) => {
    const { removeItem, updateItemStockWithStock, updateItemStock } = useCart();
    const [error, setError] = useState('');

    const decrement = () => {
        setError('');
        const newStock = item.stock - 1;
        updateItemStock(item.id, newStock, item.talle);
    };

    const increment = async () => {
        setError('');
        const newStock = item.stock + 1;
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
                <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    {item.talle && <p className="cart-item-size">Talle: {item.talle}</p>}
                    <p className='unit-price'>Precio unitario: ${item.price}</p>
                    <p className="cart-item-price">Subtotal: ${item.price * item.stock}</p>
                    <div className="quantity-controls">
                        <button onClick={decrement} className="qty-button">-</button>
                        <div className="qty-number">{item.stock}</div>
                        <button onClick={increment} className="qty-button">+</button>
                    </div>
                    {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                </div>
            </div>
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