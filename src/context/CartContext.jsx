import { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CartContext = createContext();

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

export const CartProvider = ({ children }) => {
    // Inicializar el carrito desde localStorage si existe
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error('Error leyendo cart desde localStorage', err);
            return [];
        }
    });

    // Persistir el carrito en localStorage cuando cambie
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (err) {
            console.error('Error guardando cart en localStorage', err);
        }
    }, [cart]);

    // Sincronizar entre pestañas/ventanas (opcional)
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'cart') {
                try {
                    setCart(e.newValue ? JSON.parse(e.newValue) : []);
                } catch (err) {
                    console.error('Error parsing cart from storage event', err);
                }
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const addItem = (item, stock) => {
        setCart(prev => {
            const exists = prev.some(p => p.id === item.id);
            if (!exists) {
                return [...prev, { ...item, stock }];
            }
            return prev.map(prod =>
                prod.id === item.id ? { ...prod, stock: prod.stock + stock } : prod
            );
        });
    };

        // Agrega item validando stock actual en Firestore
        const addItemWithStock = async (item, stockToAdd, selectedTalle = null) => {
            try {
                const docRef = doc(db, 'items', item.id);
                const snap = await getDoc(docRef);
                if (!snap.exists()) return { success: false, message: 'Producto no encontrado' };
                const data = snap.data();
                const dataStock = typeof data.stock === 'number' ? data.stock : Infinity;
                const currentStock = cart.find(p => p.id === item.id && p.talle === selectedTalle)?.stock ?? 0;
                if (currentStock + stockToAdd > dataStock) {
                    return { success: false, message: 'No hay suficiente stock disponible. Revisa el carrito o disponibilidad de stock' };
                }

                // Si alcanza, actualizar el carrito
                setCart(prev => {
                    const exists = prev.some(p => p.id === item.id && p.talle === selectedTalle);
                    if (!exists) {
                        return [...prev, { ...item, stock: stockToAdd, talle: selectedTalle }];
                    }
                    return prev.map(prod =>
                        prod.id === item.id && prod.talle === selectedTalle ? { ...prod, stock: prod.stock + stockToAdd } : prod
                    );
                });

                return { success: true };
            } catch (err) {
                console.error('addItemWithStock error', err);
                return { success: false, message: err.message };
            }
        };

    const removeItem = (itemId, talle = null) => {
        setCart(prev => prev.filter(prod => !(prod.id === itemId && prod.talle === talle)));
    };

    const updateItemStock = (itemId, newStock, talle = null) => {
        setCart(prev => {
            if (newStock <= 0) {
                return prev.filter(p => !(p.id === itemId && p.talle === talle));
            }
            return prev.map(p => 
                p.id === itemId && p.talle === talle ? { ...p, stock: newStock } : p
            );
        });
    };

    // Actualiza la cantidad validando stock en Firestore
    const updateItemStockWithStock = async (itemId, newStock, selectedTalle = null) => {
        try {
            const docRef = doc(db, 'items', itemId);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return { success: false, message: 'Producto no encontrado' };
            
            const data = snap.data();
            let availableStock = 0;
            
            console.log('Debug - Data from Firebase:', data);
            console.log('Debug - Selected talle:', selectedTalle);
            
            // Calcular stock disponible según el nuevo formato
            if (selectedTalle && data.talles && data.talles[selectedTalle]) {
                console.log('Debug - Talle data:', data.talles[selectedTalle]);
                availableStock = calculateTalleStock(data.talles[selectedTalle]);
                console.log('Debug - Available stock for talle:', availableStock);
            } else if (data.talles) {
                console.log('Debug - All talles:', data.talles);
                availableStock = calculateTotalStock(data.talles);
                console.log('Debug - Total available stock:', availableStock);
            } else {
                // Fallback para productos sin estructura de talles
                availableStock = typeof data.stock === 'number' ? data.stock : 0;
                console.log('Debug - Fallback stock:', availableStock);
            }

            console.log('Debug - New stock requested:', newStock, 'Available:', availableStock);

            if (newStock > availableStock) {
                return { 
                    success: false, 
                    message: `Stock insuficiente. Disponible: ${availableStock}` 
                };
            }

            setCart(prev => {
                if (newStock <= 0) {
                    return prev.filter(p => !(p.id === itemId && p.talle === selectedTalle));
                }
                return prev.map(p => 
                    p.id === itemId && p.talle === selectedTalle ? 
                        { ...p, stock: newStock } : p
                );
            });

            return { success: true };
        } catch (err) {
            console.error('updateItemStockWithStock error', err);
            return { success: false, message: err.message };
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (id) => {
        return cart.some(prod => prod.id === id);
    };

    const getTotalStock = () => {
        return cart.reduce((total, item) => total + (item.stock || 0), 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * (item.stock || 0)), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
                removeItem,
                updateItemStock,
                addItemWithStock,
                updateItemStockWithStock,
            clearCart,
            isInCart,
            getTotalStock,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);