# 👟 Shoes Store - Ecommerce de Calzados

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 📋 Descripción

**Shoes Store** es una aplicación de ecommerce moderna y responsive desarrollada con React, especializada en la venta de calzados. Ofrece una experiencia de usuario intuitiva y completa, desde la navegación de productos hasta el proceso de checkout.

### ✨ Características Principales

- 🛍️ **Catálogo completo** con filtros avanzados por categoría, marca, género y precio
- 🔍 **Búsqueda inteligente** que no distingue mayúsculas, minúsculas ni acentos
- 🛒 **Carrito de compras** persistente con gestión de talles y stock
- 🎯 **Navegación intuitiva** con dropdowns dinámicos y enlaces directos
- 💳 **Checkout completo** con validación de datos y gestión de órdenes
- 🚚 **Opciones de entrega** (retiro en tienda y envío a domicilio)
- 🎁 **Empaque premium** opcional para regalos
- ✅ **Gestión de stock** en tiempo real con Firebase


## 🛠️ Tecnologías Utilizadas

### Frontend

- **React** - Biblioteca principal de interfaz de usuario
- **React Router DOM** - Navegación y enrutamiento
- **Context API** - Gestión de estado global del carrito
- **CSS3** - Estilos modernos con gradientes y animaciones
- **Vite** - Herramienta de desarrollo y build

### Backend & Base de Datos

- **Firebase Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Hosting y deployment


## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── CartItem.jsx     # Item individual del carrito
│   ├── CartWidget.jsx   # Widget contador del carrito
│   ├── CheckoutForm.jsx # Formulario de checkout
│   ├── DeliverySelector.jsx # Selector de entrega
│   ├── Item.jsx         # Card de producto
│   ├── ItemDetail.jsx   # Detalle del producto
│   ├── ItemList.jsx     # Lista de productos
│   ├── NavBar.jsx       # Barra de navegación
│   ├── ProductFilters.jsx # Filtros de productos
│   ├── SearchBar.jsx    # Barra de búsqueda
│   └── ...
├── context/             # Contextos de React
│   └── CartContext.jsx  # Contexto del carrito
├── firebase/            # Configuración de Firebase
│   └── config.js        # Configuración de Firestore
├── pages/               # Páginas principales
│   ├── Cart.jsx         # Página del carrito
│   ├── Contact.jsx      # Página de contacto
│   └── ...
├── styles/              # Archivos CSS
│   └── *.css           # Estilos por componente
└── assets/              # Recursos estáticos
    └── medios_pagos/    # Imágenes de medios de pago
```

## 🎯 Funcionalidades Detalladas

### 🛍️ Catálogo de Productos

- **Filtros avanzados**: Por categoría, marca, género y rango de precios
- **Búsqueda inteligente**: Búsqueda en tiempo real sin distinción de acentos
- **Filtros activos**: Visualización y eliminación individual de filtros
- **Navegación por URL**: URLs amigables para categorías y marcas

### 🛒 Carrito de Compras

- **Gestión de talles**: Soporte completo para diferentes talles
- **Validación de stock**: Verificación en tiempo real de disponibilidad
- **Persistencia**: El carrito se mantiene entre sesiones
- **Modificación de cantidad**: Incremento/decremento con validaciones

### 💳 Proceso de Checkout

- **Validación de formulario**: Validación completa de datos del cliente
- **Verificación de stock**: Control final antes de procesar la orden
- **Gestión de órdenes**: Creación y almacenamiento en Firebase
- **Actualización de inventario**: Reducción automática de stock post-compra

### 🚚 Opciones de Entrega

- **Retiro en tienda**: Opción gratuita
- **Envío a domicilio**: Con envío gratis para compras superiores a $4000
- **Empaque premium**: Opción de bolsa de regalo

## 🎨 Diseño y UX

- **Glass**: Efectos modernos de cristal 
- **Animaciones suaves**: Transiciones y hover effects
- **Gradientes modernos**: Paleta de colores atractiva
- **Navegación intuitiva**: UX optimizada 

## 🔄 Gestión de Estado

- **Context API**: Gestión centralizada del carrito
- **Estado local**: Para formularios y componentes específicos
- **Sincronización**: Estado sincronizado con Firebase en tiempo real


## 📈 Performance

- **Lazy Loading**: Carga diferida de componentes
- **Optimización de imágenes**: Formatos optimizados
- **Bundle splitting**: Código dividido para carga eficiente
- **CSS optimizado**: Eliminación de código no utilizado

