import { Link } from 'react-router-dom';
import '../styles/Item.css';

const Item = ({ id, title, price, image, description, stock, categoryId, marca, genero }) => {
    return (
        <div className="item-card">
            <img src={image} alt={title} className="item-image" />
            <div className="item-content">
                <h3 className="item-title">{title}</h3>
                <p className="item-price">${price}</p>
                <Link
                    to={`/item/${id}`}
                    className="item-detail-link"
                >
                    Ver detalles
                </Link>
                <p className='item-category'>
                    <Link
                        to={`/category/${encodeURIComponent(categoryId)}`}
                        className="item-category-link"
                    >
                        {categoryId}
                    </Link>
                    {' '}
                    <span className="separator">•</span>
                    {' '}
                    <Link
                        to={`/marca/${encodeURIComponent(marca)}`}
                        className="item-brand-link"
                    >
                        {marca}
                    </Link>
                    {' '}
                    <span className="separator">•</span>
                    {' '}
                    <Link
                        to={`/genero/${encodeURIComponent(genero)}`}
                        className="item-subcategory-link"
                    >
                        {genero}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Item;