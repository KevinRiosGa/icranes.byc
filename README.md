# BYC Core - Sistema de Gestión Empresarial

**Versión:** 1.0.0  
**Framework:** Django 5.2.6  
**Base de datos:** PostgreSQL  
**Idioma:** Español (Chile)  
**Estado:** Desarrollo inicial  

## 📋 Descripción del Proyecto

BYC Core es un sistema de gestión empresarial desarrollado en Django, diseñado para proporcionar una plataforma integral de administración de personal, maquinarias, planificación y gestión de datos empresariales.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
icranes.byc/
├── bycCore/                    # Aplicación principal de Django
│   ├── __init__.py
│   ├── asgi.py                # Configuración ASGI
│   ├── settings.py            # Configuraciones del proyecto
│   ├── urls.py                # URLs principales
│   ├── views.py               # Vistas del sistema
│   └── wsgi.py                # Configuración WSGI
├── static/                     # Archivos estáticos
│   ├── css/
│   │   └── styles.css         # Estilos personalizados
│   ├── img/
│   │   └── logo/              # Logos del sistema
│   ├── js/
│   │   └── main.js            # JavaScript principal
│   └── vendors/               # Librerías externas
│       ├── bootstrap-5.3.7/   # Bootstrap CSS/JS
│       ├── bootstrap-icons-1.11.3/ # Iconografía
│       ├── datatables-2.3.2/  # Tablas dinámicas
│       └── jQuery-3.7.1/      # jQuery
├── templates/                  # Plantillas HTML
│   ├── base/
│   │   └── base.html          # Plantilla base
│   ├── errors/                # Páginas de error (400, 403, 404, 500)
│   ├── includes/              # Componentes reutilizables
│   │   ├── navbar.html        # Barra de navegación superior
│   │   └── sidebar.html       # Menú lateral
│   └── pages/
│       └── home.html          # Página principal (dashboard)
├── prompts/                    # Prompts para desarrollo futuro
│   ├── prompt.txt             # Prompt para diseño del layout
│   └── 2.prompt_app_usuarios.txt # Prompt para sistema de usuarios
├── venv2/                      # Entorno virtual
├── manage.py                   # Script de gestión de Django
└── README.md                   # Este archivo
```

## ⚙️ Configuración Técnica

### Base de Datos
- **Motor:** PostgreSQL
- **Nombre:** BYCDB
- **Host:** localhost
- **Puerto:** 5432
- **Credenciales:** Usuario `postgres`, contraseña `123456`

### Configuraciones Principales
- **DEBUG:** `True` (desarrollo)
- **LANGUAGE_CODE:** `es-CL` (Español Chile)
- **TIME_ZONE:** `America/Santiago`
- **SECRET_KEY:** Configurada para desarrollo

### Dependencias Principales
- Django 5.2.6
- psycopg2 2.9.10 (PostgreSQL adapter)
- sqlparse 0.5.3

## 🎨 Interfaz de Usuario

### Diseño Visual
- **Framework CSS:** Bootstrap 5.3.7
- **Iconografía:** Bootstrap Icons 1.11.3
- **Esquema de colores:** Oscuro (#212122 para sidebar/navbar, #f8f9fa para contenido)
- **Diseño:** Responsive con sidebar colapsible

### Componentes UI Implementados

#### 1. Navbar Superior
- Logo del sistema (modo oscuro)
- Botón hamburguesa para toggle del sidebar
- Sistema de notificaciones con badge
- Perfil de usuario con dropdown
- Completamente responsive

#### 2. Sidebar Lateral
- **Estructura modular** con secciones organizadas:
  - **GESTIÓN DE PERSONAL:** Fichas personales, analytics
  - **MAQUINARIAS:** Órdenes de trabajo, bases de equipos
  - **PLANIFICACIÓN:** Personal y maquinarias
  - **BASES:** Usuarios, datos maestros
- **Funcionalidades:**
  - Menús multinivel (hasta 3 niveles)
  - Animaciones suaves de expansión/colapso
  - Estado persistente en localStorage
  - Hover effects y estados activos

#### 3. Dashboard Principal
- **Tarjetas de métricas:** Ventas, clientes activos, proyectos, solicitudes
- **Gráficos:** Áreas para ingresos y gráfico circular para fuentes
- **Tabla de datos:** Transacciones recientes con DataTables
- **Responsive:** Adaptable a diferentes tamaños de pantalla

## 🚀 Funcionalidades Actuales

### Vista Principal (Home)
**URL:** `/`  
**Template:** `pages/home.html`  
**Vista:** `bycCore.views.home`

**Características:**
- Dashboard con métricas ficticias de ejemplo
- 4 tarjetas de estadísticas principales
- Áreas para gráficos (preparadas para Chart.js)
- Tabla de transacciones con DataTables
- Breadcrumb de navegación
- Botones de acción

### Gestión de Archivos Estáticos
- Configuración para archivos locales (sin CDN)
- Organización modular de CSS/JS
- Optimización de carga de recursos

## 🔧 JavaScript y Interactividad

### BYCCore Object
Objeto principal que maneja toda la funcionalidad JavaScript:

**Características principales:**
- **Gestión de Sidebar:** Toggle, show/hide, estados responsivos
- **Persistencia:** Estados guardados en localStorage
- **Navegación:** Detección automática de enlaces activos
- **Submenús:** Gestión de menús multinivel
- **Responsive:** Adaptación automática a diferentes breakpoints
- **Accesibilidad:** Soporte para atajos de teclado (Ctrl+B, Escape)

### DataTables
- Configuración en español (es-ES)
- Responsive habilitado
- Paginación y ordenamiento
- 10 elementos por página por defecto

## 📱 Responsive Design

### Breakpoints
- **Desktop:** ≥ 992px - Sidebar visible por defecto
- **Tablet:** 768px - 991px - Sidebar colapsado
- **Mobile:** < 768px - Sidebar overlay

### Adaptaciones Móviles
- Sidebar se convierte en overlay
- Avatar de usuario se oculta
- Padding reducido en contenido
- Gestos táctiles optimizados

## 🗄️ Estructura de URLs

```python
urlpatterns = [
    path('admin/', admin.site.urls),          # Panel admin Django
    path('', views.home, name='home'),        # Dashboard principal
]
```

## 🎯 Estado Actual del Desarrollo

### ✅ Completado
- [x] Configuración base del proyecto Django
- [x] Conexión a base de datos PostgreSQL
- [x] Layout responsive con Bootstrap 5
- [x] Sidebar colapsible funcional
- [x] Dashboard principal con métricas ficticias
- [x] Sistema de navegación multinivel
- [x] Configuración de archivos estáticos
- [x] Templates base organizados
- [x] JavaScript modular y documentado
- [x] Páginas de error personalizadas
- [x] Configuración de idioma español chileno

### 🔄 En Desarrollo
- [ ] Sistema de autenticación y usuarios
- [ ] Gestión de personal
- [ ] Módulo de maquinarias
- [ ] Sistema de planificación
- [ ] Bases de datos maestras
- [ ] Reportes y analytics reales

### 📋 Planificado
Según los prompts encontrados en el directorio `/prompts/`:
- [ ] **Sistema completo de usuarios** con roles y permisos granulares
- [ ] **Autenticación robusta** con sesiones seguras
- [ ] **Panel de administración** personalizado (sin usar Django admin)
- [ ] **Gestión de personal** con fichas completas
- [ ] **Módulo de maquinarias** con órdenes de trabajo
- [ ] **Sistema de planificación** para personal y equipos

## 🔒 Seguridad

### Configuraciones Actuales
- CSRF protection habilitado
- Middleware de seguridad configurado
- Validadores de contraseña estándar de Django
- XFrame protection habilitado

### Pendiente de Implementar
- Sistema de autenticación personalizado
- Gestión de roles y permisos
- Logging de eventos de seguridad
- Políticas de contraseñas avanzadas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- PostgreSQL 12+
- Git

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd icranes.byc
```

2. **Crear y activar entorno virtual:**
```bash
python -m venv venv2
# Windows
venv2\Scripts\activate
# Linux/Mac
source venv2/bin/activate
```

3. **Instalar dependencias:**
```bash
pip install django==5.2.6 psycopg2==2.9.10
```

4. **Configurar base de datos:**
- Crear base de datos PostgreSQL llamada `BYCDB`
- Asegurarse de que las credenciales en `settings.py` sean correctas

5. **Ejecutar migraciones:**
```bash
python manage.py migrate
```

6. **Crear superusuario:**
```bash
python manage.py createsuperuser
```

7. **Ejecutar servidor de desarrollo:**
```bash
python manage.py runserver
```

8. **Acceder a la aplicación:**
- URL: http://localhost:8000
- Admin: http://localhost:8000/admin

## 👥 Roles y Estructura Organizacional

Según la planificación, el sistema estará orientado a:
- **Administradores del sistema**
- **Gerentes de personal**
- **Supervisores de maquinarias**
- **Operadores**
- **Personal general**

## 📊 Módulos Planificados

### 1. Gestión de Personal
- Fichas de empleados
- Control de asistencia
- Evaluaciones de desempeño

### 2. Maquinarias
- Inventario de equipos
- Órdenes de trabajo
- Mantenimientos
- Bases: tipos, marcas, modelos

### 3. Planificación
- Calendario de personal
- Programación de maquinarias
- Asignación de recursos

### 4. Bases del Sistema
- Gestión de usuarios y roles
- Datos maestros (regiones, comunas, empresas)
- Configuraciones del sistema

## 🔧 Herramientas de Desarrollo

### Dependencias de Desarrollo
- Django Debug Toolbar (recomendado)
- Django Extensions (recomendado)
- Coverage.py para pruebas

### Comandos Útiles
```bash
# Crear nueva app
python manage.py startapp nombre_app

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ejecutar pruebas
python manage.py test

# Recopilar archivos estáticos
python manage.py collectstatic
```

## 📝 Convenciones de Código

- **Idioma:** Todo en español (variables, comentarios, documentación)
- **Estilo:** PEP 8 para Python
- **Templates:** Organización modular con herencia
- **CSS:** Metodología BEM para clases personalizadas
- **JavaScript:** ES6+ con documentación JSDoc

## 🔍 Notas Técnicas

### Base de Datos
- Configurada para PostgreSQL pero fácilmente migrable a otros motores
- Preparada para múltiples ambientes (desarrollo/producción)

### Frontend
- Sin dependencias de CDN, todo local para mayor control
- Preparado para integración con librerías de gráficos (Chart.js)
- Optimizado para carga rápida

### Arquitectura
- Preparado para escalabilidad horizontal
- Estructura modular para fácil mantenimiento
- Separación clara entre lógica de negocio y presentación

---

**Autor:** Kevin  
**Fecha:** Septiembre 2025  
**Contacto:** [Información de contacto]  

> **Nota:** Este proyecto está en desarrollo activo. Para contribuir o reportar issues, consulte la documentación de desarrollo o contacte al equipo técnico.
