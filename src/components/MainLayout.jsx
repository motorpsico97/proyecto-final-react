import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

// Layout principal: muestra la NavBar y Footer para todas las rutas hijas
// Aplicado para ocultar la NavBar en las rutas que no son correctas -> 404
const MainLayout = () => {
    return (
        <div className="app-container">
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;
