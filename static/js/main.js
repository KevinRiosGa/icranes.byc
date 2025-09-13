/**
 * BYC CORE - JAVASCRIPT PRINCIPAL
 * Sistema de Gestión Empresarial
 * 
 * Este archivo contiene toda la funcionalidad JavaScript del sistema,
 * incluyendo la gestión del sidebar, navegación y interacciones de UI.
 */

// Objeto principal de la aplicación
const BYCCore = {
    
    // Variables de estado
    sidebar: {
        element: null,
        mainContent: null,
        overlay: null
    },
    
    // Configuración
    config: {
        breakpoint: 992, // Breakpoint para responsive
        animationDuration: 300 // Duración de animaciones
    },
    
    /**
     * Inicializa la aplicación cuando el DOM está listo
     */
    init: function() {
        console.log('Inicializando BYC Core System...');
        
        // Cachear elementos del DOM
        this.cacheElements();
        
        // Configurar event listeners
        this.bindEvents();
        
        // Configurar estado inicial del sidebar
        this.setupInitialState();
        
        // Configurar scroll independiente
        this.setupIndependentScroll();
        
        // Inicializar tooltips de Bootstrap
        this.initializeTooltips();
        
        console.log('BYC Core System inicializado correctamente');
    },
    
    /**
     * Cachea los elementos del DOM más utilizados
     */
    cacheElements: function() {
        this.sidebar.element = document.getElementById('sidebar');
        this.sidebar.mainContent = document.getElementById('main-content');
        this.sidebar.overlay = document.getElementById('sidebar-overlay');
        this.toggleButton = document.getElementById('sidebar-toggle');
        this.closeButton = document.getElementById('sidebar-close');
    },
    
    /**
     * Configura todos los event listeners necesarios
     */
    bindEvents: function() {
        // Toggle del sidebar (botón hamburguesa)
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }
        
        // Botón cerrar sidebar (móvil)
        if (this.closeButton) {
            this.closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideSidebar();
            });
        }
        
        // Overlay para cerrar sidebar en móvil
        if (this.sidebar.overlay) {
            this.sidebar.overlay.addEventListener('click', () => {
                this.hideSidebar();
            });
        }
        
        // Los event listeners de hover del sidebar han sido eliminados
        
        // Listener para cambios de tamaño de ventana
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
        
        // Prevenir cierre accidental de submenús
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sidebar') && window.innerWidth >= this.config.breakpoint) {
                // Solo cerrar submenús si no es un clic dentro del sidebar
                this.closeAllSubmenus();
            }
        });
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    },
    
    /**
     * Configura el estado inicial del sidebar según el tamaño de pantalla
     */
    setupInitialState: function() {
        const windowWidth = window.innerWidth;
        
        // Recuperar estado guardado del localStorage
        const savedState = localStorage.getItem('byc-sidebar-visible');
        
        if (savedState !== null) {
            // Usar estado guardado
            const isVisible = JSON.parse(savedState);
            if (isVisible) {
                this.showSidebar();
            } else {
                this.hideSidebar();
            }
        } else {
            // Estado por defecto
            if (windowWidth < this.config.breakpoint) {
                // En móvil: sidebar oculto por defecto
                this.hideSidebar();
            } else {
                // En desktop: sidebar visible por defecto
                this.showSidebar();
            }
        }
    },
    
    /**
     * Alterna el estado del sidebar (mostrar/ocultar completamente)
     */
    toggleSidebar: function() {
        // Tanto en móvil como en desktop: mostrar/ocultar sidebar completamente
        const isVisible = this.sidebar.element.classList.contains('show');
        if (isVisible) {
            this.hideSidebar();
        } else {
            this.showSidebar();
        }
    },
    
    /**
     * Muestra el sidebar
     */
    showSidebar: function() {
        if (!this.sidebar.element) return;
        
        const windowWidth = window.innerWidth;
        
        // Mostrar sidebar
        this.sidebar.element.classList.add('show');
        this.sidebar.mainContent.classList.remove('sidebar-hidden');
        
        if (windowWidth < this.config.breakpoint) {
            // En móvil: mostrar overlay
            this.sidebar.overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        // Guardar estado en localStorage
        localStorage.setItem('byc-sidebar-visible', 'true');
    },
    
    /**
     * Oculta el sidebar
     */
    hideSidebar: function() {
        if (!this.sidebar.element) return;
        
        // Cerrar todos los submenús al ocultar
        this.closeAllSubmenus();
        
        // Ocultar sidebar
        this.sidebar.element.classList.remove('show');
        this.sidebar.mainContent.classList.add('sidebar-hidden');
        
        // Ocultar overlay y restaurar scroll del body
        this.sidebar.overlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Guardar estado en localStorage
        localStorage.setItem('byc-sidebar-visible', 'false');
    },
    
    /**
     * Actualiza el estado visual del sidebar (simplificado)
     */
    updateSidebarState: function() {
        // Esta función se mantiene para compatibilidad pero ya no es necesaria
        // El estado se maneja directamente en showSidebar/hideSidebar
    },
    
    
    /**
     * Maneja el redimensionamiento de la ventana
     */
    handleWindowResize: function() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth >= this.config.breakpoint) {
            // Cambio a desktop
            this.sidebar.overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // Restaurar estado del sidebar desde localStorage
            const savedState = localStorage.getItem('byc-sidebar-collapsed');
            if (savedState !== null) {
                this.sidebar.isCollapsed = JSON.parse(savedState);
                this.updateSidebarState();
            }
            
        } else {
            // Cambio a móvil
            this.sidebar.element.classList.remove('collapsed', 'show');
            this.sidebar.mainContent.classList.remove('sidebar-collapsed');
            this.sidebar.isCollapsed = false;
        }
    },
    
    /**
     * Cierra todos los submenús abiertos
     */
    closeAllSubmenus: function() {
        const openSubmenus = document.querySelectorAll('.sidebar-submenu.show, .sidebar-sub-submenu.show');
        openSubmenus.forEach(submenu => {
            const bsCollapse = bootstrap.Collapse.getInstance(submenu);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
        
        // Resetear iconos de flechas
        const expandedLinks = document.querySelectorAll('.sidebar-link[aria-expanded=\"true\"], .sidebar-sublink[aria-expanded=\"true\"]');
        expandedLinks.forEach(link => {
            link.setAttribute('aria-expanded', 'false');
        });
    },
    
    /**
     * Maneja los atajos de teclado
     */
    handleKeyboardShortcuts: function(e) {
        // Ctrl + B: Toggle sidebar
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            this.toggleSidebar();
        }
        
        // Escape: Cerrar sidebar en móvil
        if (e.key === 'Escape') {
            const windowWidth = window.innerWidth;
            if (windowWidth < this.config.breakpoint && this.sidebar.element.classList.contains('show')) {
                this.hideSidebar();
            }
        }
    },
    
    /**
     * Inicializa los tooltips de Bootstrap
     */
    initializeTooltips: function() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    },
    
    /**
     * Función debounce para optimizar eventos de resize
     */
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
    },
    
    /**
     * Configura el scroll independiente para sidebar y main content
     */
    setupIndependentScroll: function() {
        const sidebar = this.sidebar.element;
        const mainContent = this.sidebar.mainContent;
        
        if (!sidebar || !mainContent) return;
        
        // Prevenir propagación del scroll del sidebar al main content
        sidebar.addEventListener('wheel', function(e) {
            const delta = e.deltaY;
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const height = this.clientHeight;
            
            // Si se intenta hacer scroll hacia arriba y ya está en el top
            if (delta < 0 && scrollTop === 0) {
                e.preventDefault();
                return false;
            }
            
            // Si se intenta hacer scroll hacia abajo y ya está en el bottom
            if (delta > 0 && scrollTop + height >= scrollHeight) {
                e.preventDefault();
                return false;
            }
            
            // Detener propagación en todos los casos
            e.stopPropagation();
        }, { passive: false });
        
        // Prevenir propagación del scroll del main content al sidebar
        mainContent.addEventListener('wheel', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        // También manejar el scroll táctil en dispositivos móviles
        sidebar.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        mainContent.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: true });
    },
    
    /**
     * Utilidad para logging con timestamp
     */
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
};

// Extensión para manejo de submenús
BYCCore.submenu = {
    
    /**
     * Inicializa los event listeners para submenús
     */
    init: function() {
        document.addEventListener('shown.bs.collapse', (e) => {
            if (e.target.classList.contains('sidebar-submenu') || e.target.classList.contains('sidebar-sub-submenu')) {
                BYCCore.submenu.onSubmenuOpen(e.target);
            }
        });
        
        document.addEventListener('hidden.bs.collapse', (e) => {
            if (e.target.classList.contains('sidebar-submenu') || e.target.classList.contains('sidebar-sub-submenu')) {
                BYCCore.submenu.onSubmenuClose(e.target);
            }
        });
    },
    
    /**
     * Callback cuando se abre un submenú
     */
    onSubmenuOpen: function(submenuElement) {
        // Scroll automático si es necesario
        const sidebar = document.getElementById('sidebar');
        const rect = submenuElement.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        
        if (rect.bottom > sidebarRect.bottom) {
            submenuElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    },
    
    /**
     * Callback cuando se cierra un submenú
     */
    onSubmenuClose: function(submenuElement) {
        // Cerrar submenús anidados si los hay
        const nestedSubmenus = submenuElement.querySelectorAll('.sidebar-sub-submenu.show');
        nestedSubmenus.forEach(nested => {
            const bsCollapse = bootstrap.Collapse.getInstance(nested);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
    }
};

// Extensión para gestión de navegación activa
BYCCore.navigation = {
    
    /**
     * Marca el elemento de navegación activo basado en la URL actual
     */
    setActiveNavigation: function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar-link, .sidebar-sublink, .sidebar-sub-sublink');
        
        // Remover clases activas existentes
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Encontrar y marcar el enlace activo
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === currentPath || currentPath.startsWith(href + '/'))) {
                link.classList.add('active');
                
                // Expandir submenús padre si es necesario
                this.expandParentMenus(link);
            }
        });
    },
    
    /**
     * Expande los menús padre del elemento activo
     */
    expandParentMenus: function(activeLink) {
        let parent = activeLink.closest('.sidebar-submenu, .sidebar-sub-submenu');
        
        while (parent) {
            const bsCollapse = bootstrap.Collapse.getInstance(parent) || new bootstrap.Collapse(parent, { show: true });
            bsCollapse.show();
            
            // Marcar el enlace padre como expandido
            const parentLink = document.querySelector(`[data-bs-target=\"#${parent.id}\"]`);
            if (parentLink) {
                parentLink.setAttribute('aria-expanded', 'true');
            }
            
            // Buscar el siguiente nivel padre
            parent = parent.closest('.sidebar-submenu, .sidebar-sub-submenu');
            if (parent && parent.id === parent.closest('.sidebar-submenu, .sidebar-sub-submenu').id) {
                break; // Evitar bucle infinito
            }
        }
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    BYCCore.init();
    BYCCore.submenu.init();
    BYCCore.navigation.setActiveNavigation();
});

// Actualizar navegación activa cuando cambia la página (para SPAs)
window.addEventListener('popstate', function() {
    BYCCore.navigation.setActiveNavigation();
});

// Exportar para uso global
window.BYCCore = BYCCore;
