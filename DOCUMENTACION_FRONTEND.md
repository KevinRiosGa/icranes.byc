# Documentación Frontend - BYC Core

## 🎨 Arquitectura Frontend

El sistema frontend de BYC Core está construido con una arquitectura modular que combina:
- **Bootstrap 5.3.7** para componentes UI
- **JavaScript ES6+** orientado a objetos
- **CSS personalizado** con variables CSS
- **jQuery 3.7.1** para manipulación DOM
- **DataTables 2.3.2** para tablas avanzadas

---

## 📁 Estructura de Archivos

```
static/
├── css/
│   └── styles.css              # Estilos personalizados principales
├── js/
│   └── main.js                 # JavaScript principal del sistema
├── img/
│   └── logo/
│       ├── logo_dark_mode.webp # Logo para modo oscuro
│       └── logo_light_mode.webp # Logo para modo claro
└── vendors/                    # Librerías externas
    ├── bootstrap-5.3.7/
    │   ├── css/bootstrap.min.css
    │   └── js/bootstrap.min.js
    ├── bootstrap-icons-1.11.3/
    │   ├── css/bootstrap-icons.min.css
    │   └── fonts/
    ├── datatables-2.3.2/
    │   ├── css/datatables.min.css
    │   ├── js/datatables.min.js
    │   └── i18n/es-ES.json     # Traducción español
    └── jQuery-3.7.1/
        └── js/jquery-3.7.1.js
```

---

## ⚙️ Sistema JavaScript

### Objeto Principal: BYCCore

El sistema JavaScript está centralizado en el objeto `BYCCore` que maneja toda la funcionalidad del frontend.

#### Estructura del Objeto

```javascript
const BYCCore = {
    // Variables de estado
    sidebar: {
        element: null,
        mainContent: null,
        overlay: null
    },
    
    // Configuración global
    config: {
        breakpoint: 992,         // Breakpoint responsive
        animationDuration: 300   // Duración de animaciones
    },
    
    // Métodos principales
    init(),                     // Inicialización
    cacheElements(),           // Cache de elementos DOM
    bindEvents(),              // Event listeners
    setupInitialState(),       // Estado inicial
    toggleSidebar(),           // Toggle del sidebar
    // ... más métodos
};
```

#### Inicialización

```javascript
// Se ejecuta automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    BYCCore.init();
    BYCCore.submenu.init();
    BYCCore.navigation.setActiveNavigation();
});
```

### Gestión del Sidebar

#### Estados del Sidebar

```javascript
// Sidebar visible
sidebar.classList.add('show');
mainContent.classList.remove('sidebar-hidden');

// Sidebar oculto
sidebar.classList.remove('show'); 
mainContent.classList.add('sidebar-hidden');
```

#### Persistencia de Estado

```javascript
// Guardar estado en localStorage
localStorage.setItem('byc-sidebar-visible', 'true');

// Recuperar estado
const savedState = localStorage.getItem('byc-sidebar-visible');
const isVisible = JSON.parse(savedState);
```

#### Responsive Behavior

```javascript
// Breakpoint para cambio de comportamiento
const windowWidth = window.innerWidth;

if (windowWidth < this.config.breakpoint) {
    // Comportamiento móvil: overlay + bloqueo scroll
    this.sidebar.overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
} else {
    // Comportamiento desktop: sidebar fijo
    this.sidebar.overlay.classList.remove('show');
    document.body.style.overflow = '';
}
```

### Gestión de Submenús

#### Extensión BYCCore.submenu

```javascript
BYCCore.submenu = {
    init: function() {
        // Event listeners para Bootstrap Collapse
        document.addEventListener('shown.bs.collapse', (e) => {
            if (e.target.classList.contains('sidebar-submenu')) {
                this.onSubmenuOpen(e.target);
            }
        });
    },
    
    onSubmenuOpen: function(submenuElement) {
        // Auto-scroll si el submenú queda fuera de vista
        const sidebar = document.getElementById('sidebar');
        const rect = submenuElement.getBoundingClientRect();
        
        if (rect.bottom > sidebar.getBoundingClientRect().bottom) {
            submenuElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }
};
```

### Navegación Activa

#### Detección Automática

```javascript
BYCCore.navigation = {
    setActiveNavigation: function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar-link, .sidebar-sublink, .sidebar-sub-sublink');
        
        // Encontrar enlace activo basado en URL
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.startsWith(href)) {
                link.classList.add('active');
                this.expandParentMenus(link);
            }
        });
    }
};
```

### Atajos de Teclado

```javascript
handleKeyboardShortcuts: function(e) {
    // Ctrl + B: Toggle sidebar
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
    }
    
    // Escape: Cerrar sidebar en móvil
    if (e.key === 'Escape') {
        if (this.sidebar.element.classList.contains('show')) {
            this.hideSidebar();
        }
    }
}
```

### Optimizaciones

#### Debouncing para Resize

```javascript
debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Uso
window.addEventListener('resize', this.debounce(() => {
    this.handleWindowResize();
}, 250));
```

#### Scroll Independiente

```javascript
setupIndependentScroll: function() {
    const sidebar = this.sidebar.element;
    
    // Prevenir propagación del scroll
    sidebar.addEventListener('wheel', function(e) {
        const delta = e.deltaY;
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const height = this.clientHeight;
        
        // Prevenir scroll en límites
        if ((delta < 0 && scrollTop === 0) || 
            (delta > 0 && scrollTop + height >= scrollHeight)) {
            e.preventDefault();
            return false;
        }
        
        e.stopPropagation();
    }, { passive: false });
}
```

---

## 🎨 Sistema CSS

### Variables CSS

```css
:root {
    /* Colores principales */
    --sidebar-bg: #212122;
    --navbar-bg: #212122;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --active-bg: rgba(0, 123, 255, 0.2);
    --text-light: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.7);
    
    /* Dimensiones */
    --sidebar-width: 230px;
    --navbar-height: 60px;
    
    /* Transiciones */
    --sidebar-transition: all 0.3s ease-in-out;
    
    /* Bordes y separadores */
    --border-color: rgba(255, 255, 255, 0.1);
}
```

### Layout Principal

#### Wrapper y Estructura

```css
.wrapper {
    display: flex;
    width: 100%;
    align-items: stretch;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    height: 100vh;
}
```

#### Navbar Superior

```css
#main-navbar {
    background-color: var(--navbar-bg) !important;
    height: var(--navbar-height);
    z-index: 1040;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#sidebar-toggle {
    color: var(--text-light);
    transition: var(--sidebar-transition);
}

#sidebar-toggle:hover {
    background-color: var(--hover-bg);
}
```

### Sidebar

#### Estados y Transiciones

```css
.sidebar {
    width: var(--sidebar-width);
    height: calc(100vh - var(--navbar-height));
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    background-color: var(--sidebar-bg);
    transition: transform 0.3s ease-in-out;
    z-index: 1035;
    /* Por defecto oculto */
    transform: translateX(-100%);
}

/* Sidebar visible */
.sidebar.show {
    transform: translateX(0);
}
```

#### Elementos de Navegación

```css
.sidebar-link {
    display: flex;
    align-items: center;
    padding: 0.3rem 1rem;
    color: var(--text-light);
    text-decoration: none;
    transition: var(--sidebar-transition);
    position: relative;
    font-size: 0.9rem;
    min-height: 32px;
}

.sidebar-link:hover {
    color: var(--text-light);
    background-color: var(--hover-bg);
    border-radius: 0.5rem;
}

.sidebar-icon {
    width: 20px;
    height: 20px;
    margin-right: 0.75rem;
    font-size: 0.9rem;
    text-align: center;
    flex-shrink: 0;
}
```

#### Submenús Multinivel

```css
/* Nivel 1 - Submenús principales */
.sidebar-sublink {
    padding: 0.3rem 1.5rem 0.3rem 3rem;
    color: var(--text-muted);
    font-size: 0.9rem;
}

/* Nivel 2 - Sub-submenús */
.sidebar-sub-sublink {
    padding: 0.3rem 1.5rem 0.3rem 4.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.sidebar-sub-sublink.active {
    background-color: var(--active-bg);
    color: var(--text-light);
    border-radius: 0.5rem;
}
```

#### Flechas de Expansión

```css
.sidebar-arrow {
    margin-left: auto;
    transition: transform 0.3s ease, opacity 0.3s ease;
    font-size: 0.75rem;
    width: 16px;
    height: 16px;
}

.sidebar-link[aria-expanded="true"] .sidebar-arrow {
    transform: rotate(180deg);
}
```

### Main Content

#### Área de Contenido Principal

```css
.main-content {
    margin-left: 0;
    margin-top: var(--navbar-height);
    height: calc(100vh - var(--navbar-height));
    transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
    width: 100%;
    background-color: #f8f9fa;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Estados según visibilidad del sidebar */
.main-content:not(.sidebar-hidden) {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}

.main-content.sidebar-hidden {
    margin-left: 0;
    width: 100%;
}
```

### Responsive Design

#### Breakpoints

```css
/* Tablets y pantallas medianas */
@media (max-width: 991.98px) {
    .sidebar {
        transform: translateX(-100%);
    }
    
    .sidebar.show {
        transform: translateX(0);
    }
    
    .main-content,
    .main-content:not(.sidebar-hidden),
    .main-content.sidebar-hidden {
        margin-left: 0;
        width: 100%;
    }
}

/* Móviles */
@media (max-width: 575.98px) {
    .sidebar {
        width: 100% !important;
    }
    
    .content-container {
        padding: 1rem;
    }
    
    .user-info {
        display: none !important;
    }
}
```

#### Overlay para Móvil

```css
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1030;
    display: none;
}

.sidebar-overlay.show {
    display: block;
}
```

### Scrollbars Personalizados

```css
/* Sidebar scrollbar */
.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
}
```

### Componentes de Dashboard

#### Tarjetas con Bordes de Color

```css
.border-left-primary {
    border-left: 0.25rem solid #4e73df !important;
}

.border-left-success {
    border-left: 0.25rem solid #1cc88a !important;
}

.border-left-info {
    border-left: 0.25rem solid #36b9cc !important;
}

.border-left-warning {
    border-left: 0.25rem solid #f6c23e !important;
}
```

#### Colores de Texto

```css
.text-gray-800 {
    color: #5a5c69 !important;
}

.text-white-25 {
    color: rgba(255, 255, 255, 0.25) !important;
}

.text-white-50 {
    color: rgba(255, 255, 255, 0.5) !important;
}
```

#### Animaciones

```css
/* Animación de pulso para notificaciones */
.badge-notification {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

/* Animación de rotación para loading */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

---

## 📊 DataTables Configuration

### Configuración Básica

```javascript
$('#dataTable').DataTable({
    "language": {
        "url": "/static/vendors/datatables-2.3.2/i18n/es-ES.json"
    },
    "responsive": true,
    "pageLength": 10,
    "order": [[ 4, "desc" ]],
    "columnDefs": [
        {
            "targets": -1,      // Última columna (acciones)
            "orderable": false, // No ordenable
            "searchable": false // No buscable
        }
    ]
});
```

### Configuración Avanzada

```javascript
$('#tablaCompleta').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "url": "/api/datos/",
        "type": "POST",
        "data": function(d) {
            d.csrfmiddlewaretoken = $('[name=csrfmiddlewaretoken]').val();
        }
    },
    "columns": [
        { "data": "id" },
        { "data": "nombre" },
        { "data": "email" },
        { "data": "fecha_creacion" },
        { 
            "data": null,
            "render": function(data, type, row) {
                return `
                    <button class="btn btn-sm btn-primary" onclick="verDetalle(${row.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                `;
            }
        }
    ],
    "language": {
        "url": "/static/vendors/datatables-2.3.2/i18n/es-ES.json"
    },
    "pageLength": 25,
    "responsive": true
});
```

---

## 🔧 Extensibilidad

### Agregar Nuevos Componentes JavaScript

#### Estructura Modular

```javascript
// Extensión para nuevo módulo
BYCCore.modulo = {
    init: function() {
        this.bindEvents();
        this.setupComponents();
    },
    
    bindEvents: function() {
        // Event listeners específicos del módulo
        $('.btn-modulo').on('click', this.handleClick.bind(this));
    },
    
    setupComponents: function() {
        // Inicialización de componentes
        this.initializeModals();
        this.initializeForms();
    },
    
    handleClick: function(e) {
        e.preventDefault();
        // Lógica del módulo
    }
};

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.modulo-container')) {
        BYCCore.modulo.init();
    }
});
```

### Agregar Nuevos Estilos

#### Convención de Nomenclatura

```css
/* Nuevos componentes con prefijo byc- */
.byc-componente {
    /* Estilos base */
}

.byc-componente--modificador {
    /* Variación del componente */
}

.byc-componente__elemento {
    /* Elemento del componente */
}

/* Uso de variables CSS existentes */
.byc-nuevo-sidebar-item {
    background-color: var(--sidebar-bg);
    color: var(--text-light);
    transition: var(--sidebar-transition);
}
```

### Templates de Componentes

#### Modal Estándar

```html
<!-- Modal Template -->
<div class="modal fade" id="modalEjemplo" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-icon me-2"></i>Título del Modal
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <!-- Contenido del modal -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button type="button" class="btn btn-primary" id="btnConfirmar">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</div>
```

#### Card Template

```html
<!-- Card Template -->
<div class="col-xl-3 col-md-6 mb-3">
    <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Título Métrica
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">Valor</div>
                </div>
                <div class="col-auto">
                    <i class="bi bi-graph-up text-primary" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 🚀 Performance y Optimización

### Carga de Scripts

```html
<!-- Orden de carga optimizado -->
<!-- jQuery primero -->
<script src="{% static 'vendors/jQuery-3.7.1/js/jquery-3.7.1.js' %}"></script>

<!-- Bootstrap después -->
<script src="{% static 'vendors/bootstrap-5.3.7/js/bootstrap.min.js' %}"></script>

<!-- DataTables después de jQuery -->
<script src="{% static 'vendors/datatables-2.3.2/js/datatables.min.js' %}"></script>

<!-- Script principal al final -->
<script src="{% static 'js/main.js' %}"></script>
```

### Lazy Loading para Componentes

```javascript
// Carga condicional de componentes pesados
const loadChartJS = () => {
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = '/static/vendors/chart.js/chart.min.js';
        script.onload = () => {
            // Inicializar gráficos
            initializeCharts();
        };
        document.head.appendChild(script);
    }
};

// Cargar solo si hay gráficos en la página
if (document.querySelector('.chart-container')) {
    loadChartJS();
}
```

### Optimización CSS

```css
/* Usar contain para optimizar rendering */
.sidebar {
    contain: layout style paint;
}

.main-content {
    contain: layout style;
}

/* GPU acceleration para animaciones */
.sidebar {
    will-change: transform;
}

.sidebar-link {
    will-change: background-color;
}
```

---

## 🔍 Debugging y Troubleshooting

### Console Logging

```javascript
// Logging con timestamp en BYCCore
log: function(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] BYC Core - ${message}`;
    
    switch(level) {
        case 'error':
            console.error(logMessage);
            break;
        case 'warn':
            console.warn(logMessage);
            break;
        default:
            console.log(logMessage);
    }
}

// Uso
BYCCore.log('Sidebar inicializado correctamente');
BYCCore.log('Error al cargar datos', 'error');
```

### Herramientas de Desarrollo

```javascript
// Exponer BYCCore globalmente para debugging
window.BYCCore = BYCCore;

// Funciones de debug
window.debugSidebar = function() {
    console.log('Sidebar state:', {
        isVisible: BYCCore.sidebar.element.classList.contains('show'),
        isCollapsed: BYCCore.sidebar.element.classList.contains('collapsed'),
        windowWidth: window.innerWidth,
        breakpoint: BYCCore.config.breakpoint
    });
};

// CSS para debugging layout
.debug-layout * {
    outline: 1px solid red !important;
}
```

---

**Última actualización:** Septiembre 2025  
**Versión:** 1.0.0  
**Mantenido por:** Equipo Frontend BYC Core
