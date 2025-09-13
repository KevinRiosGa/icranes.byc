# Guía de Desarrollo - BYC Core

## 🎯 Estándares de Desarrollo

### Lenguajes y Convenciones

#### Python/Django
- **Estilo:** Seguir PEP 8
- **Idioma:** Español para variables, funciones, clases y comentarios
- **Nombrado:** snake_case para variables y funciones, PascalCase para clases
- **Documentación:** Docstrings en español con formato Google Style

```python
class GestionUsuario:
    """
    Clase para la gestión integral de usuarios del sistema.
    
    Maneja operaciones CRUD, autenticación y permisos de usuarios.
    """
    
    def crear_usuario(self, datos_usuario):
        """
        Crea un nuevo usuario en el sistema.
        
        Args:
            datos_usuario (dict): Diccionario con los datos del usuario
            
        Returns:
            Usuario: Instancia del usuario creado
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        pass
```

#### HTML/Templates
- **Idioma:** Español para contenido y comentarios
- **Indentación:** 4 espacios
- **Estructura:** Uso obligatorio de bloques de Django
- **Componentes:** Modularización con includes

```html
{% extends 'base/base.html' %}
{% load static %}

{% block title %}Gestión de Usuarios - BYC Core{% endblock %}

{% block content %}
<!-- Contenido principal de la página -->
<div class="container-fluid">
    {% include 'components/breadcrumb.html' %}
    <!-- Resto del contenido -->
</div>
{% endblock %}
```

#### CSS
- **Metodología:** BEM para clases personalizadas
- **Variables:** CSS Custom Properties obligatorias
- **Prefijos:** `byc-` para clases personalizadas del sistema

```css
/* Componente principal */
.byc-card {
    /* Estilos base */
}

/* Modificador del componente */
.byc-card--highlighted {
    /* Variación del componente */
}

/* Elemento del componente */
.byc-card__title {
    /* Elemento específico */
}
```

#### JavaScript
- **Estilo:** ES6+
- **Documentación:** JSDoc en español
- **Estructura:** Orientado a objetos
- **Nombrado:** camelCase

```javascript
/**
 * Gestiona las operaciones de usuarios en el frontend
 * @class GestionUsuarios
 */
class GestionUsuarios {
    /**
     * Inicializa la gestión de usuarios
     * @param {Object} opciones - Configuraciones iniciales
     */
    constructor(opciones = {}) {
        this.configuracion = opciones;
    }
    
    /**
     * Carga la lista de usuarios desde el servidor
     * @async
     * @returns {Promise<Array>} Lista de usuarios
     */
    async cargarUsuarios() {
        // Implementación
    }
}
```

---

## 🏗️ Arquitectura de Aplicaciones

### Estructura Estándar de App Django

```
nombre_app/
├── __init__.py
├── admin.py              # Registro de modelos (si es necesario)
├── apps.py               # Configuración de la app
├── models.py             # Modelos de datos
├── views.py              # Vistas (Solo CBV)
├── urls.py               # URLs de la app
├── forms.py              # Formularios de Django
├── mixins.py             # Mixins personalizados
├── permissions.py        # Permisos personalizados
├── serializers.py        # Serializers (para API)
├── tests/
│   ├── __init__.py
│   ├── test_models.py    # Tests de modelos
│   ├── test_views.py     # Tests de vistas
│   └── test_forms.py     # Tests de formularios
├── templates/
│   └── nombre_app/
│       ├── base_app.html         # Base específica de la app
│       ├── lista_objetos.html    # ListView
│       ├── detalle_objeto.html   # DetailView
│       ├── crear_objeto.html     # CreateView
│       └── actualizar_objeto.html # UpdateView
├── static/
│   └── nombre_app/
│       ├── css/
│       │   └── nombre_app.css
│       ├── js/
│       │   └── nombre_app.js
│       └── img/
└── migrations/
    └── __init__.py
```

### Patrón de Vistas (Obligatorio CBV)

#### ListView
```python
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class ListaUsuariosView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    """Vista para mostrar lista de usuarios del sistema."""
    
    model = Usuario
    template_name = 'gen_usuarios/lista_usuarios.html'
    context_object_name = 'usuarios'
    paginate_by = 25
    permission_required = 'gen_usuarios.view_usuario'
    
    def get_queryset(self):
        """Personaliza el queryset base."""
        return Usuario.objects.filter(activo=True).order_by('-fecha_creacion')
    
    def get_context_data(self, **kwargs):
        """Agrega datos adicionales al contexto."""
        context = super().get_context_data(**kwargs)
        context['titulo_pagina'] = 'Gestión de Usuarios'
        context['total_usuarios'] = self.get_queryset().count()
        return context
```

#### CreateView
```python
class CrearUsuarioView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    """Vista para crear nuevo usuario."""
    
    model = Usuario
    form_class = FormularioUsuario
    template_name = 'gen_usuarios/crear_usuario.html'
    permission_required = 'gen_usuarios.add_usuario'
    success_url = reverse_lazy('gen_usuarios:lista_usuarios')
    
    def form_valid(self, form):
        """Procesa formulario válido."""
        usuario = form.save(commit=False)
        usuario.creado_por = self.request.user
        usuario.save()
        
        messages.success(
            self.request, 
            f'Usuario {usuario.username} creado exitosamente.'
        )
        return super().form_valid(form)
```

### Mixins Obligatorios

```python
# mixins.py
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

class AuditoriaCreacionMixin:
    """Mixin para auditar creación de objetos."""
    
    def form_valid(self, form):
        if hasattr(form.instance, 'creado_por'):
            form.instance.creado_por = self.request.user
        return super().form_valid(form)

class AuditoriaModificacionMixin:
    """Mixin para auditar modificación de objetos."""
    
    def form_valid(self, form):
        if hasattr(form.instance, 'modificado_por'):
            form.instance.modificado_por = self.request.user
        return super().form_valid(form)

class MensajeExitosoMixin:
    """Mixin para mostrar mensajes de éxito automáticamente."""
    
    mensaje_exito = None
    
    def form_valid(self, form):
        if self.mensaje_exito:
            messages.success(self.request, self.mensaje_exito)
        return super().form_valid(form)
```

---

## 🗄️ Modelos de Datos

### Modelo Base Estándar

```python
from django.db import models
from django.contrib.auth.models import User

class ModeloBase(models.Model):
    """
    Modelo base abstracto con campos de auditoría estándar.
    Todos los modelos del sistema deben heredar de esta clase.
    """
    
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de Creación'
    )
    fecha_modificacion = models.DateTimeField(
        auto_now=True,
        verbose_name='Fecha de Modificación'
    )
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='%(class)s_creados',
        verbose_name='Creado Por'
    )
    modificado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='%(class)s_modificados',
        verbose_name='Modificado Por',
        null=True,
        blank=True
    )
    activo = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    
    class Meta:
        abstract = True
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.__class__.__name__} #{self.pk}"
```

### Ejemplo de Modelo Específico

```python
class Usuario(ModeloBase):
    """Modelo extendido de usuario del sistema."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name='Usuario Django'
    )
    rut = models.CharField(
        max_length=12,
        unique=True,
        verbose_name='RUT'
    )
    telefono = models.CharField(
        max_length=15,
        blank=True,
        verbose_name='Teléfono'
    )
    cargo = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Cargo'
    )
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        permissions = [
            ('view_dashboard_usuario', 'Puede ver dashboard de usuarios'),
            ('export_usuarios', 'Puede exportar usuarios'),
        ]
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.rut})"
    
    def nombre_completo(self):
        """Retorna el nombre completo del usuario."""
        return self.user.get_full_name() or self.user.username
```

---

## 📝 Formularios

### Formulario Estándar

```python
from django import forms
from django.core.exceptions import ValidationError

class FormularioUsuario(forms.ModelForm):
    """Formulario para gestión de usuarios."""
    
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Ingrese contraseña'
        })
    )
    password2 = forms.CharField(
        label='Confirmar Contraseña',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirme contraseña'
        })
    )
    
    class Meta:
        model = Usuario
        fields = ['rut', 'telefono', 'cargo']
        widgets = {
            'rut': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '12.345.678-9'
            }),
            'telefono': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+56 9 8765 4321'
            }),
            'cargo': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Cargo del usuario'
            }),
        }
    
    def clean_rut(self):
        """Valida formato del RUT chileno."""
        rut = self.cleaned_data['rut']
        # Implementar validación de RUT
        return rut
    
    def clean(self):
        """Validación de formulario completo."""
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        
        if password1 and password2:
            if password1 != password2:
                raise ValidationError("Las contraseñas no coinciden.")
        
        return cleaned_data
```

---

## 🌐 URLs y Routing

### Estructura de URLs por App

```python
# gen_usuarios/urls.py
from django.urls import path
from . import views

app_name = 'gen_usuarios'

urlpatterns = [
    # Listado y CRUD básico
    path('', views.ListaUsuariosView.as_view(), name='lista_usuarios'),
    path('crear/', views.CrearUsuarioView.as_view(), name='crear_usuario'),
    path('<int:pk>/', views.DetalleUsuarioView.as_view(), name='detalle_usuario'),
    path('<int:pk>/editar/', views.EditarUsuarioView.as_view(), name='editar_usuario'),
    path('<int:pk>/eliminar/', views.EliminarUsuarioView.as_view(), name='eliminar_usuario'),
    
    # Funcionalidades específicas
    path('dashboard/', views.DashboardUsuariosView.as_view(), name='dashboard_usuarios'),
    path('roles/', views.ListaRolesView.as_view(), name='lista_roles'),
    path('permisos/', views.GestionPermisosView.as_view(), name='gestion_permisos'),
    
    # AJAX endpoints
    path('ajax/buscar/', views.BuscarUsuariosAjaxView.as_view(), name='buscar_usuarios_ajax'),
    path('ajax/toggle-activo/<int:pk>/', views.ToggleActivoAjaxView.as_view(), name='toggle_activo_ajax'),
]
```

### URLs Principal

```python
# bycCore/urls.py
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    
    # Apps del sistema
    path('usuarios/', include('gen_usuarios.urls')),
    path('maquinarias/', include('gen_maquinarias.urls')),
    path('planificacion/', include('gen_planificacion.urls')),
    path('bases/', include('gen_bases.urls')),
    
    # API endpoints
    path('api/v1/', include('api.urls')),
]
```

---

## 📄 Templates y Frontend

### Estructura de Templates

#### Template Base de App
```html
<!-- gen_usuarios/templates/gen_usuarios/base_usuarios.html -->
{% extends 'base/base.html' %}
{% load static %}

{% block title %}{% block titulo_pagina %}Usuarios{% endblock %} - BYC Core{% endblock %}

{% block extra_head %}
    <link href="{% static 'gen_usuarios/css/usuarios.css' %}" rel="stylesheet">
{% endblock %}

{% block content %}
<div class="container-fluid">
    {% block breadcrumb %}
    <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{% url 'home' %}">Inicio</a></li>
            <li class="breadcrumb-item"><a href="{% url 'gen_usuarios:lista_usuarios' %}">Usuarios</a></li>
            {% block breadcrumb_extra %}{% endblock %}
        </ol>
    </nav>
    {% endblock %}
    
    {% block header_pagina %}
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="h3 mb-1 text-gray-800">{% block titulo_header %}{% endblock %}</h1>
                    <p class="text-muted mb-0">{% block subtitulo_header %}{% endblock %}</p>
                </div>
                <div>
                    {% block botones_header %}{% endblock %}
                </div>
            </div>
        </div>
    </div>
    {% endblock %}
    
    {% block contenido_principal %}
    <!-- Contenido específico de cada vista -->
    {% endblock %}
</div>
{% endblock %}

{% block extra_js %}
    <script src="{% static 'gen_usuarios/js/usuarios.js' %}"></script>
    {% block javascript_extra %}{% endblock %}
{% endblock %}
```

#### ListView Template
```html
<!-- gen_usuarios/templates/gen_usuarios/lista_usuarios.html -->
{% extends 'gen_usuarios/base_usuarios.html' %}
{% load static %}

{% block titulo_pagina %}Lista de Usuarios{% endblock %}
{% block titulo_header %}Gestión de Usuarios{% endblock %}
{% block subtitulo_header %}Administrar usuarios del sistema{% endblock %}

{% block botones_header %}
<a href="{% url 'gen_usuarios:crear_usuario' %}" class="btn btn-primary">
    <i class="bi bi-plus-circle me-1"></i>Nuevo Usuario
</a>
{% endblock %}

{% block contenido_principal %}
<div class="row">
    <div class="col-12">
        <div class="card shadow">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="bi bi-people me-2"></i>Usuarios del Sistema
                    <span class="badge bg-info ms-2">{{ total_usuarios }}</span>
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="tablaUsuarios">
                        <thead>
                            <tr>
                                <th>RUT</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Cargo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for usuario in usuarios %}
                            <tr>
                                <td>{{ usuario.rut }}</td>
                                <td>{{ usuario.nombre_completo }}</td>
                                <td>{{ usuario.user.email }}</td>
                                <td>{{ usuario.cargo|default:"-" }}</td>
                                <td>
                                    {% if usuario.activo %}
                                        <span class="badge bg-success">Activo</span>
                                    {% else %}
                                        <span class="badge bg-danger">Inactivo</span>
                                    {% endif %}
                                </td>
                                <td>
                                    <a href="{% url 'gen_usuarios:detalle_usuario' usuario.pk %}" 
                                       class="btn btn-sm btn-outline-primary" title="Ver">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="{% url 'gen_usuarios:editar_usuario' usuario.pk %}" 
                                       class="btn btn-sm btn-outline-secondary" title="Editar">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                </td>
                            </tr>
                            {% empty %}
                            <tr>
                                <td colspan="6" class="text-center">No hay usuarios registrados</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                
                {% if is_paginated %}
                <nav aria-label="Paginación">
                    <ul class="pagination justify-content-center">
                        {% if page_obj.has_previous %}
                            <li class="page-item">
                                <a class="page-link" href="?page=1">Primera</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.previous_page_number }}">Anterior</a>
                            </li>
                        {% endif %}
                        
                        <li class="page-item active">
                            <span class="page-link">
                                Página {{ page_obj.number }} de {{ page_obj.paginator.num_pages }}
                            </span>
                        </li>
                        
                        {% if page_obj.has_next %}
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.next_page_number }}">Siguiente</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.paginator.num_pages }}">Última</a>
                            </li>
                        {% endif %}
                    </ul>
                </nav>
                {% endif %}
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block javascript_extra %}
<script>
$(document).ready(function() {
    $('#tablaUsuarios').DataTable({
        "language": {
            "url": "{% static 'vendors/datatables-2.3.2/i18n/es-ES.json' %}"
        },
        "responsive": true,
        "pageLength": 25,
        "order": [[ 1, "asc" ]]
    });
});
</script>
{% endblock %}
```

---

## 🧪 Testing

### Estructura de Tests

```python
# gen_usuarios/tests/test_models.py
from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Usuario

class UsuarioModelTest(TestCase):
    """Tests para el modelo Usuario."""
    
    def setUp(self):
        """Configuración inicial para cada test."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_crear_usuario(self):
        """Test de creación de usuario."""
        usuario = Usuario.objects.create(
            user=self.user,
            rut='12345678-9',
            cargo='Desarrollador',
            creado_por=self.user
        )
        
        self.assertEqual(usuario.rut, '12345678-9')
        self.assertEqual(usuario.cargo, 'Desarrollador')
        self.assertTrue(usuario.activo)
    
    def test_str_representation(self):
        """Test de representación string del modelo."""
        usuario = Usuario.objects.create(
            user=self.user,
            rut='12345678-9',
            creado_por=self.user
        )
        
        expected = f"{self.user.get_full_name()} (12345678-9)"
        self.assertEqual(str(usuario), expected)
```

### Tests de Vistas

```python
# gen_usuarios/tests/test_views.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User, Permission
from ..models import Usuario

class ListaUsuariosViewTest(TestCase):
    """Tests para la vista de lista de usuarios."""
    
    def setUp(self):
        """Configuración inicial."""
        self.client = Client()
        self.user = User.objects.create_user(
            username='admin',
            password='adminpassword123'
        )
        # Agregar permisos necesarios
        permission = Permission.objects.get(codename='view_usuario')
        self.user.user_permissions.add(permission)
        
    def test_vista_requiere_login(self):
        """Test que la vista requiere autenticación."""
        url = reverse('gen_usuarios:lista_usuarios')
        response = self.client.get(url)
        self.assertRedirects(response, '/login/?next=' + url)
    
    def test_vista_con_usuario_autenticado(self):
        """Test de vista con usuario autenticado y con permisos."""
        self.client.login(username='admin', password='adminpassword123')
        url = reverse('gen_usuarios:lista_usuarios')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Gestión de Usuarios')
```

---

## 🔧 Herramientas y Comandos

### Comandos de Gestión Personalizados

```python
# gen_usuarios/management/commands/crear_usuarios_prueba.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from gen_usuarios.models import Usuario

class Command(BaseCommand):
    """Comando para crear usuarios de prueba."""
    
    help = 'Crea usuarios de prueba para desarrollo'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--cantidad',
            type=int,
            default=10,
            help='Cantidad de usuarios a crear'
        )
    
    def handle(self, *args, **options):
        cantidad = options['cantidad']
        
        for i in range(cantidad):
            username = f'usuario{i+1}'
            email = f'usuario{i+1}@ejemplo.com'
            
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='password123'
                )
                
                Usuario.objects.create(
                    user=user,
                    rut=f'1234567{i}-{i%10}',
                    cargo=f'Cargo de prueba {i+1}',
                    creado_por_id=1  # Admin
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Usuario {username} creado')
                )
```

### Scripts de Deploy

```bash
#!/bin/bash
# scripts/deploy.sh

echo "Iniciando deploy de BYC Core..."

# Activar entorno virtual
source venv2/Scripts/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Ejecutar tests
python manage.py test

echo "Deploy completado exitosamente!"
```

---

## 📊 Logging y Monitoreo

### Configuración de Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/byc_core.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'gen_usuarios': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

---

## 🚀 Checklist de Nueva Funcionalidad

### Antes de Empezar
- [ ] Revisar documentación existente
- [ ] Crear rama de desarrollo: `git checkout -b feature/nueva-funcionalidad`
- [ ] Actualizar requirements.txt si es necesario

### Desarrollo
- [ ] Crear modelos con herencia de `ModeloBase`
- [ ] Implementar vistas usando solo CBV
- [ ] Crear formularios con validaciones
- [ ] Desarrollar templates con herencia adecuada
- [ ] Implementar JavaScript modular
- [ ] Agregar CSS siguiendo convenciones BEM

### Testing
- [ ] Crear tests unitarios para modelos
- [ ] Crear tests de integración para vistas
- [ ] Ejecutar tests: `python manage.py test`
- [ ] Verificar cobertura de código

### Documentación
- [ ] Actualizar docstrings en código
- [ ] Crear documentación de usuario si aplica
- [ ] Actualizar CHANGELOG.md

### Deploy
- [ ] Crear migraciones: `python manage.py makemigrations`
- [ ] Verificar migraciones: `python manage.py sqlmigrate app 0001`
- [ ] Hacer commit con mensaje descriptivo
- [ ] Crear Pull Request
- [ ] Review de código por equipo
- [ ] Merge a rama principal

---

**Última actualización:** Septiembre 2025  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo BYC Core
