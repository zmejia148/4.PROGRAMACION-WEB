**************** LINK REPOSITORIO GITHUB **************************
https://github.com/zmejia148/4.PROGRAMACION-WEB

------------  Descripción  ------------
CinePlus es una aplicación web para consultar películas en cartelera, ver detalles, tráilers, etc.

Estructura del Proyecto

Tarea1/
├── index.html              # Página principal con cartelera
├── pages/
│   ├── renta.html          # Formulario de renta de películas
│   ├── detalle.html        # Detalle individual de película
│   └── contacto.html       # Formulario de contacto
├── css/
│   ├── style.css           # Estilos principales
│   ├── styleDet.css        # Estilos para página de detalle
│   └── styleCon.css        # Estilos para página de contacto
├── js/
│   ├── app.js              # Lógica principal de la aplicación
│   └── contacto.js         # Lógica del formulario de contacto
├── data/
│   ├── peliculas.json      # Base de datos de películas
│   └── reseñas.json        # Reseñas de usuarios
└── img/                    # Imágenes de las películas

Instrucciones de Uso
1. Configuración Inicial
clonar el proyecto en su equipo con el siguiente link https://github.com/zmejia148/4.PROGRAMACION-WEB.git
Una ves se haya clonado correctamente seleccionamos el archivo index.html de clic derecho y seleccione la opción de open with live server.

2. Navegación Básica
Página Principal: Ver todas las películas disponibles
Ver Detalles: Click en "Ver más" de cualquier película
Rentar: Desde detalles o página de renta directa en la parte superior del menu se puede acceder a la vista de rentar
Contacto: Formulario para consultas generales

3. Proceso de Renta
Seleccionar películas deseadas
Completar datos personales (nombre, email),Especificar días de renta (1-30), Elegir método de pago,Confirmar renta, estos datos son obligatorios en caso de no llenarlos el aplicativo siempre le redireccionara al campo

4. Características Técnicas
Responsive: Compatible con dispositivos móviles
Persistencia: Almacenamiento local para mensaje de bienvenida
Validación: Formularios con validación en tiempo real
API Simulada: Datos cargados desde archivos JSON locales
Dependencias
Bootstrap 5.3.2
jQuery 3.6.4
Bootstrap Icons (CDN)
peliculas.json: Información de películas (título, género, precios, tráiler)
reseñas.json: Comentarios y calificaciones de usuarios

Notas de Desarrollo
Las imágenes deben estar en la carpeta img/
Los precios se calculan automáticamente según fecha de estreno
Los modales requieren Bootstrap para funcionar correctamente
La aplicación simula un proceso completo de renta sin backend
Requiere JavaScript habilitado

