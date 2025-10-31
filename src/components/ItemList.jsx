import Item from './Item';
import '../styles/ItemList.css';

const ItemList = ({ products }) => {
    return (
        <div className="item-list">
            {products.map(product => (
                <Item key={product.id} {...product} />
            ))}
        </div>
    );
};

export default ItemList;