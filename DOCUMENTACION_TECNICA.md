# Documentación Técnica - BYC Core

## 📚 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Componentes Frontend](#componentes-frontend)
3. [Estructura de Base de Datos](#estructura-de-base-de-datos)
4. [Sistema de Templates](#sistema-de-templates)
5. [JavaScript y Funcionalidades](#javascript-y-funcionalidades)
6. [Estilos CSS](#estilos-css)
7. [Configuración Django](#configuración-django)
8. [Flujo de Desarrollo](#flujo-de-desarrollo)

---

## 🏗️ Arquitectura del Sistema

### Patrón MVT de Django

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Model      │    │      View       │    │    Template     │
│                 │    │                 │    │                 │
│  - Sin modelos  │◄──►│  - views.home   │◄──►│  - base.html    │
│    definidos    │    │  - Context data │    │  - home.html    │
│    aún          │    │                 │    │  - includes/    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Estructura de URLs

```python
# bycCore/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),     # Django Admin
    path('', views.home, name='home'),   # Dashboard Principal
]
```

### Vista Principal

```python
# bycCore/views.py
def home(request):
    """
    Vista principal del sistema - Dashboard
    Retorna datos ficticios para demostración
    """
    context = {
        'page_title': 'Dashboard Principal',
        'user_name': 'Alina Mclourd',
        'user_role': 'VP, People Manager',
    }
    return render(request, 'pages/home.html', context)
```

---

## 🎨 Componentes Frontend

### Layout Principal

#### 1. Base Template (`base.html`)

**Características:**
- DOCTYPE HTML5
- Meta viewport para responsive
- Carga de recursos estáticos locales
- Bloques extensibles para personalización

**Bloques disponibles:**
```django
{% block title %}          # Título de la página
{% block extra_head %}     # CSS/JS adicional en head
{% block header_content %} # Contenido adicional en header
{% block content %}        # Contenido principal
{% block extra_js %}       # JavaScript adicional
```

#### 2. Navbar (`includes/navbar.html`)

**Estructura:**
```html
<nav class="navbar navbar-dark bg-dark fixed-top">
  ├── Logo + Botón Hamburguesa
  ├── Sección central (expandible)
  └── Sección derecha
      ├── Notificaciones (dropdown)
      └── Perfil Usuario (dropdown)
</nav>
```

**Funcionalidades:**
- Toggle del sidebar responsive
- Sistema de notificaciones con badge
- Dropdown de perfil con opciones
- Logo adaptable según modo claro/oscuro

#### 3. Sidebar (`includes/sidebar.html`)

**Estructura jerárquica:**
```
Sidebar
├── Sección: GESTIÓN DE PERSONAL
│   └── Ficha personal
│       ├── Analytics
│       │   ├── Commerce (activo)
│       │   └── Sales
│       ├── Minimal
│       │   ├── Variation 1
│       │   └── Variation 2
│       └── CRM
├── Sección: MAQUINARIAS
│   ├── Orden de trabajo
│   └── Bases
│       ├── Tipo equipos
│       ├── Marcas
│       └── Modelos
├── Sección: PLANIFICACIÓN
│   ├── Planificación personal
│   └── Planificación maquinarias
└── Sección: BASES
    ├── Gestión usuarios
    └── Bases
        ├── Comunas
        ├── Empresas
        ├── Regiones
        └── Un. medida
```

### Dashboard Components

#### Tarjetas de Métricas
```html
<div class="card border-left-{color} shadow">
  ├── Título métrica
  ├── Valor principal
  └── Icono representativo
</div>
```

**Colores disponibles:**
- `primary`: Azul (#4e73df)
- `success`: Verde (#1cc88a)
- `info`: Cyan (#36b9cc)
- `warning`: Amarillo (#f6c23e)

#### Áreas de Gráficos
- Preparadas para Chart.js
- Placeholders visuales con iconos
- Responsive design

#### DataTable
```javascript
$('#dataTable').DataTable({
    "language": {
        "url": "/static/vendors/datatables-2.3.2/i18n/es-ES.json"
    },
    "responsive": true,
    "pageLength": 10,
    "order": [[ 4, "desc" ]]
});
```

---

## 🗄️ Estructura de Base de Datos

### Configuración Actual

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'BYCDB',
        'USER': 'postgres',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Modelos Planeados

Según la documentación de prompts, se planean los siguientes modelos:

#### Usuario Extendido
```python
# Planificado para gen_usuarios/models.py
class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rol = models.ForeignKey('Rol', on_delete=models.PROTECT)
    activo = models.BooleanField(default=True)
    # ... otros campos
```

#### Sistema de Roles
```python
class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    permisos = models.ManyToManyField('Permiso')
    
class Permiso(models.Model):
    modulo = models.CharField(max_length=50)
    accion = models.CharField(max_length=50)
```

---

## 📄 Sistema de Templates

### Jerarquía de Herencia

```
base.html (plantilla padre)
└── pages/home.html (extiende base)
    └── Usa includes/navbar.html
    └── Usa includes/sidebar.html
```

### Bloques y Su Uso

#### `{% block title %}`
- Define el título de la página
- Se concatena con "BYC Core"

#### `{% block content %}`
- Contenido principal de cada página
- Container fluid con sistema de grillas

#### `{% block extra_js %}`
- JavaScript específico de cada página
- DataTables, validaciones, etc.

### Archivos de Error

Preparados para diferentes códigos HTTP:
- `errors/400.html` - Bad Request
- `errors/403.html` - Forbidden
- `errors/404.html` - Not Found
- `errors/500.html` - Server Error

---

## ⚙️ JavaScript y Funcionalidades

### Objeto Principal BYCCore

#### Inicialización
```javascript
const BYCCore = {
    init: function() {
        this.cacheElements();
        this.bindEvents();
        this.setupInitialState();
        this.setupIndependentScroll();
        this.initializeTooltips();
    }
};
```

#### Gestión del Sidebar

**Estados posibles:**
- `show`: Sidebar visible
- `hide`: Sidebar oculto
- Persistencia en `localStorage`

**Métodos principales:**
```javascript
toggleSidebar()    // Alterna entre show/hide
showSidebar()      // Muestra el sidebar
hideSidebar()      // Oculta el sidebar
```

#### Responsive Breakpoints

```javascript
config: {
    breakpoint: 992,      // Tablet/Desktop
    animationDuration: 300
}
```

#### Event Listeners

**Principales eventos manejados:**
- `click` en botón hamburguesa
- `resize` de ventana (debounced)
- `keydown` para atajos (Ctrl+B, Escape)
- Bootstrap collapse events

### Submenu Management

```javascript
BYCCore.submenu = {
    onSubmenuOpen: function(submenuElement) {
        // Auto-scroll si es necesario
    },
    onSubmenuClose: function(submenuElement) {
        // Cerrar submenús anidados
    }
};
```

### Navigation Management

```javascript
BYCCore.navigation = {
    setActiveNavigation: function() {
        // Marca enlace activo basado en URL
    },
    expandParentMenus: function(activeLink) {
        // Expande menús padre del enlace activo
    }
};
```

---

## 🎨 Estilos CSS

### Variables CSS

```css
:root {
    --sidebar-bg: #212122;
    --navbar-bg: #212122;
    --sidebar-width: 230px;
    --navbar-height: 60px;
    --sidebar-transition: all 0.3s ease-in-out;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --active-bg: rgba(0, 123, 255, 0.2);
}
```

### Arquitectura CSS

#### 1. Layout General
- Flexbox para wrapper principal
- Height 100vh para full viewport
- Overflow controlado

#### 2. Navbar
- Fixed top position
- Z-index 1040
- Box-shadow para profundidad

#### 3. Sidebar
- Fixed position con transitions
- Transform para animaciones
- Overflow auto con custom scrollbar

#### 4. Main Content
- Margin dinámico según estado del sidebar
- Scroll independiente
- Responsive padding

### Classes Utility

#### Dashboard Cards
```css
.border-left-primary { border-left: 0.25rem solid #4e73df; }
.border-left-success { border-left: 0.25rem solid #1cc88a; }
.border-left-info    { border-left: 0.25rem solid #36b9cc; }
.border-left-warning { border-left: 0.25rem solid #f6c23e; }
```

#### Text Colors
```css
.text-gray-800 { color: #5a5c69; }
.text-white-25 { color: rgba(255, 255, 255, 0.25); }
.text-white-50 { color: rgba(255, 255, 255, 0.5); }
```

---

## ⚙️ Configuración Django

### Settings Principales

#### Aplicaciones Instaladas
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Apps personalizadas se agregarán aquí
]
```

#### Internacionalización
```python
LANGUAGE_CODE = 'es-CL'        # Español Chile
TIME_ZONE = 'America/Santiago' # Zona horaria Chile
USE_I18N = True               # Internacionalización
USE_TZ = True                 # Zona horaria aware
```

#### Archivos Estáticos
```python
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
```

#### Templates
```python
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]
```

### Middleware Configurado

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

---

## 🚀 Flujo de Desarrollo

### 1. Estructura de Desarrollo Actual

```
Desarrollo Base ✅
├── Layout responsive
├── Navegación funcional
├── Dashboard básico
└── Configuración Django

Próxima Fase 🔄
├── Sistema de usuarios
├── Autenticación
├── Roles y permisos
└── Panel de administración
```

### 2. Comandos de Desarrollo

#### Servidor de Desarrollo
```bash
python manage.py runserver
# Acceso: http://localhost:8000
```

#### Base de Datos
```bash
python manage.py makemigrations  # Crear migraciones
python manage.py migrate         # Aplicar migraciones
python manage.py dbshell         # Acceso directo a PostgreSQL
```

#### Superusuario
```bash
python manage.py createsuperuser
# Admin: http://localhost:8000/admin
```

### 3. Estructura de Archivos para Nuevas Apps

```python
# Comando para crear nueva app
python manage.py startapp gen_usuarios

# Estructura resultante:
gen_usuarios/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
├── models.py
├── tests.py
├── views.py
├── urls.py          # Crear manualmente
├── templates/       # Crear manualmente
└── static/         # Crear manualmente
```

### 4. Integración de Nuevos Módulos

#### Pasos para agregar nueva funcionalidad:

1. **Crear la app:**
```bash
python manage.py startapp nombre_modulo
```

2. **Registrar en settings.py:**
```python
INSTALLED_APPS = [
    # ... apps existentes
    'nombre_modulo',
]
```

3. **Configurar URLs:**
```python
# bycCore/urls.py
from django.urls import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('modulo/', include('nombre_modulo.urls')),
]
```

4. **Agregar al sidebar:**
```html
<!-- templates/includes/sidebar.html -->
<div class="sidebar-item">
    <a href="{% url 'modulo:index' %}" class="sidebar-link">
        <i class="bi bi-icon sidebar-icon"></i>
        <span class="sidebar-text">Nuevo Módulo</span>
    </a>
</div>
```

### 5. Patrones de Desarrollo

#### Views (Próximas implementaciones)
- **Solo Class-Based Views (CBV)**
- Uso obligatorio de mixins
- PermissionRequiredMixin para control de acceso
- LoginRequiredMixin para autenticación

#### Models
- Nombres en español
- Relaciones claramente definidas
- Campos con validación apropiada
- Meta classes con ordering

#### Templates
- Herencia de base.html
- Uso de includes para componentes reutilizables
- Bloques específicos para cada sección

---

## 📋 Checklist de Desarrollo

### ✅ Completado
- [x] Configuración base Django
- [x] Layout responsive
- [x] Sistema de navegación
- [x] Dashboard principal
- [x] Archivos estáticos organizados
- [x] JavaScript modular
- [x] CSS personalizado
- [x] Templates base

### 🔄 En Progreso
- [ ] Documentación completa
- [ ] Pruebas unitarias
- [ ] Optimización de rendimiento

### 📋 Pendiente
- [ ] Sistema de autenticación
- [ ] Gestión de usuarios
- [ ] Módulos de negocio
- [ ] API REST
- [ ] Reportes avanzados
- [ ] Deploy a producción

---

## 🔍 Notas de Implementación

### Performance
- Archivos estáticos locales para mejor control
- JavaScript con debouncing en events
- CSS optimizado con variables
- Lazy loading preparado para imágenes

### Seguridad
- CSRF protection habilitado
- XSS protection mediante templates
- SQL injection prevention con ORM
- Middleware de seguridad configurado

### Escalabilidad
- Estructura modular para múltiples apps
- Sistema de templates extensible
- JavaScript orientado a objetos
- CSS con metodología coherente

### Mantenibilidad
- Código documentado extensivamente
- Convenciones claras de nomenclatura
- Separación de responsabilidades
- Tests preparados para implementación

---

**Última actualización:** Septiembre 2025  
**Versión de documentación:** 1.0.0
