import { useState } from 'react';
import '../styles/ItemCount.css';

const ItemCount = ({ stock, initial = 1, onAdd }) => {
    const [count, setCount] = useState(initial);

    const increment = () => {
        if (count < stock) {
            setCount(count + 1);
        }
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    return (
        <div className="item-count">
            <div className="counter-controls">
                <button
                    onClick={decrement}
                    className="counter-button"
                    disabled={count <= 1}
                >
                    -
                </button>
                <span className="counter-number">{count}</span>
                <button
                    onClick={increment}
                    className="counter-button"
                    disabled={count >= stock}
                >
                    +
                </button>
            </div>
            <button
                onClick={() => onAdd(count)}
                className="add-to-cart-button"
                disabled={!stock}
            >
                {stock ? 'Agregar al carrito' : 'Sin stock'}
            </button>
        </div>
    );
};

export default ItemCount;