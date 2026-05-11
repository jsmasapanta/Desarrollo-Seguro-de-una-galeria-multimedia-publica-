# SecureFrame Gallery

## Desarrollo Seguro de una Galería Multimedia Pública

SecureFrame Gallery es una aplicación web full stack desarrollada bajo principios de Desarrollo Seguro de Software (SSDLC), enfocada en la gestión de galerías multimedia públicas con mecanismos avanzados de autenticación, control de acceso y detección básica de esteganografía.

El proyecto implementa múltiples controles de seguridad orientados a proteger el ciclo completo de gestión de contenido multimedia subido por usuarios.

---

# Características Principales

## Seguridad de Autenticación

* Registro seguro de usuarios.
* Contraseñas protegidas mediante hashing con bcrypt.
* Login protegido con JWT.
* Doble factor de autenticación (2FA) mediante códigos TOTP.
* Protección contra fuerza bruta mediante Rate Limiting.

## Seguridad de Acceso

* Control de acceso basado en roles (RBAC).
* Roles:

  * Usuario
  * Administrador
* Protección de rutas privadas.
* Middleware de verificación JWT.

## Seguridad Multimedia

* Subida segura de imágenes.
* Validación MIME real.
* Sanitización multimedia.
* Eliminación de metadatos EXIF.
* Reescritura segura de imágenes con Sharp.
* Detección de payloads ocultos.
* Detección de archivos ZIP renombrados como imágenes.
* Cuarentena automática de imágenes sospechosas.
* Revisión manual por administrador.

## Seguridad Web

* Helmet.
* Content Security Policy (CSP).
* Protección contra XSS.
* Protección contra Clickjacking.
* Validaciones de entrada.
* Restricción de recursos externos.

---

# Arquitectura del Sistema

## Backend

Tecnologías:

* Node.js
* Express.js
* MySQL
* JWT
* bcrypt
* Multer
* Sharp
* Speakeasy
* Helmet

## Frontend

Tecnologías:

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

---

# Estructura del Proyecto

```text
secureframe-gallery/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── uploads/
│   │   └── app.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Flujo General del Sistema

## Usuario

1. Registro.
2. Login.
3. Autenticación 2FA.
4. Solicitud de creación de álbum.
5. Subida de imágenes.
6. Validación automática de seguridad.

## Administrador

1. Revisión de álbumes pendientes.
2. Aprobación o rechazo de álbumes.
3. Revisión de imágenes sospechosas.
4. Gestión de cuarentena.
5. Aprobación o rechazo manual.

## Visitante

1. Visualización de galería pública.
2. Acceso únicamente a contenido aprobado.

---

# Controles de Seguridad Implementados

| Control                 | Implementación           |
| ----------------------- | ------------------------ |
| Hashing de contraseñas  | bcrypt                   |
| Autenticación           | JWT                      |
| 2FA                     | TOTP con Speakeasy       |
| Protección fuerza bruta | express-rate-limit       |
| CSP                     | Helmet                   |
| RBAC                    | Middleware personalizado |
| Validación MIME         | file-type                |
| Sanitización imágenes   | Sharp                    |
| Detección payload ZIP   | Análisis hexadecimal     |
| Cuarentena              | Base de datos MySQL      |
| Gestión administrativa  | Panel React              |

---

# Instalación del Proyecto

## Requisitos

* Node.js
* MySQL
* npm
* Git

---

# Configuración Backend

## Entrar al backend

```bash
cd backend
```

## Instalar dependencias

```bash
npm install
```

## Crear archivo .env

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=secureframe_gallery
JWT_SECRET=clave_segura_proyecto_2026
```

## Ejecutar backend

```bash
npm run dev
```

Servidor:

```text
http://localhost:3000
```

---

# Configuración Frontend

## Entrar al frontend

```bash
cd frontend
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar React

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Configuración Base de Datos

## Crear base de datos

```sql
CREATE DATABASE secureframe_gallery;
```

## Importar tablas

```sql
USE secureframe_gallery;
```

Tablas:

* usuarios
* albumes
* imagenes
* cuarentena

---

# Endpoints Principales

## Autenticación

| Método | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/registro |
| POST   | /api/auth/login    |

## 2FA

| Método | Endpoint         |
| ------ | ---------------- |
| GET    | /api/2fa/generar |
| POST   | /api/2fa/activar |

## Álbumes

| Método | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/album/crear       |
| GET    | /api/album/pendientes  |
| PUT    | /api/album/aprobar/:id |
| GET    | /api/album/publicos    |

## Imágenes

| Método | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/image/subir        |
| GET    | /api/image/cuarentena   |
| PUT    | /api/image/aprobar/:id  |
| PUT    | /api/image/rechazar/:id |
| GET    | /api/image/publicas     |

---

# Evidencias de Seguridad

El sistema fue probado exitosamente en:

* Detección de archivos ZIP ocultos.
* Bloqueo de archivos sospechosos.
* Cuarentena automática.
* Login protegido con 2FA.
* Restricción de acceso mediante roles.
* Protección CSP.
* Sanitización multimedia.

---

# Pruebas Realizadas

## Prueba de archivo sospechoso

Se renombró un archivo ZIP como imagen JPG.

Resultado:

```text
Posible archivo comprimido oculto
```

El sistema:

* Detectó el payload.
* Clasificó el archivo como sospechoso.
* Lo envió automáticamente a cuarentena.

---

# Principios SSDLC Aplicados

* Seguridad desde el diseño.
* Validación de entradas.
* Principio de mínimo privilegio.
* Defensa en profundidad.
* Hardening multimedia.
* Seguridad en autenticación.
* Gestión segura de contenido generado por usuarios.

---

# Estándares y Buenas Prácticas

El proyecto toma como referencia:

* OWASP Top 10
* OWASP ASVS
* NIST SP 800-218
* NIST SP 800-63
* Secure SDLC
* Principios Zero Trust

---

# Autores
Wilmer Buestan
Jefferson Masapanta


Carrera de Ingeniería de Software

Universidad de las Fuerzas Armadas ESPE

2026
