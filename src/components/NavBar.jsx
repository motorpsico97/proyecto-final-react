import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import CartWidget from './CartWidget';
import SearchBar from './SearchBar';
import '../styles/NavBar.css';
import logo from '../assets/logo.png';

const uniques = (values) => {
    const map = new Map();
    for (const v of values) {
        if (v == null) continue;
        const s = String(v).trim();
        if (!s) continue;
        const key = s.toLowerCase();
        if (!map.has(key)) map.set(key, s);
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
};

const NavBar = () => {
    const [categories, setCategories] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true);
            setError('');
            try {
                const itemsRef = collection(db, 'items');
                const snap = await getDocs(itemsRef);
                const docs = snap.docs.map(d => d.data());

                setCategories(uniques(docs.map(d => d.categoryId)));
                setMarcas(uniques(docs.map(d => d.marca ?? d.marca)));
                setGeneros(uniques(docs.map(d => d.genero ?? d.genero)));
            } catch (e) {
                console.error('NavBar fetch error:', e);
                setError('No se pudieron cargar los menús');
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo"><img src={logo} alt="Logo" /></Link>
                <div className="navbar-links">
                    {/* Categorías */}
                    <div className="navbar-dropdown">
                        <button className="dropdown-button">Categorías</button>
                        <div className="dropdown-menu">
                            {loading && <div className="dropdown-item">Cargando…</div>}
                            {error && <div className="dropdown-item">{error}</div>}
                            {!loading && !error && categories.length === 0 && (
                                <div className="dropdown-item">Sin datos</div>
                            )}
                            {!loading && !error && categories.map(cat => (
                                <Link key={cat} to={`/category/${encodeURIComponent(cat)}`} className="dropdown-item">
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Marcas */}
                    <div className="navbar-dropdown">
                        <button className="dropdown-button">Marcas</button>
                        <div className="dropdown-menu">
                            {loading && <div className="dropdown-item">Cargando…</div>}
                            {error && <div className="dropdown-item">{error}</div>}
                            {!loading && !error && marcas.length === 0 && (
                                <div className="dropdown-item">Sin datos</div>
                            )}
                            {!loading && !error && marcas.map(marca => (
                                <Link key={marca} to={`/marca/${encodeURIComponent(marca)}`} className="dropdown-item">
                                    {marca}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Género */}
                    <div className="navbar-dropdown">
                        <button className="dropdown-button">Género</button>
                        <div className="dropdown-menu">
                            {loading && <div className="dropdown-item">Cargando…</div>}
                            {error && <div className="dropdown-item">{error}</div>}
                            {!loading && !error && generos.length === 0 && (
                                <div className="dropdown-item">Sin datos</div>
                            )}
                            {!loading && !error && generos.map(g => (
                                <Link key={g} to={`/genero/${encodeURIComponent(g)}`} className="dropdown-item">
                                    {g}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Link to="/contacto" className="navbar-link">Contacto</Link>
                </div>
                <SearchBar />
                <CartWidget />
            </div>
        </nav>
    );
};

export default NavBar;
