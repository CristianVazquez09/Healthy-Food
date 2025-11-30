````md
# Healthy Food API 🍏

API base con **Express** usando patrón **MVC** (+ capa de **servicios** y **repositorios**), validación con **Zod**, acceso a datos con **mysql2/promise** y autenticación con **JWT**.

Pensada como boilerplate sencillo para:

- Crear y administrar **clientes**.
- Administrar catálogos de **categorías** y **productos** (modo admin).
- Realizar **login** con email + contraseña.
- Proteger rutas mediante **tokens JWT**.

---

## 🧱 Stack Tecnológico

- Node.js (ESM)
- Express 5
- mysql2/promise (pool + prepared statements)
- Zod (validación de entrada)
- bcryptjs (hash de contraseñas)
- JSON Web Token (jsonwebtoken)
- Nodemon (desarrollo)

---

## ✅ Requisitos Previos

- **Node.js** ≥ 18
- **MySQL** 8.x o **MariaDB** equivalente
- Usuario de MySQL con permisos para:
  - Crear bases de datos
  - Crear tablas
  - Insertar datos

Opcional:

- **MySQL Workbench**, **HeidiSQL** o cualquier otra GUI para ejecutar el script SQL.

---

## 📁 Estructura del Proyecto

```text
src/
  app.js
  server.js
  routes/
    index.js
    auth.routes.js
    clientes.routes.js
    categorias.routes.js
    productos.routes.js
  controllers/
    auth.controller.js
    cliente.controller.js
    categoria.controller.js
    producto.controller.js
  services/
    auth.service.js
    cliente.service.js
    categoria.service.js
    producto.service.js
  repositories/
    cliente.repository.js
    categoria.repository.js
    producto.repository.js
  models/
    auth.model.js
    cliente.model.js
    categoria.model.js
    producto.model.js
  middlewares/
    auth.js
    errorHandler.js
    notFound.js
  utils/
    db.js

bd/
  healthy_food.sql

public/
  index.html      # login / registro sencillo contra la API
  styles.css
  app.js          # llamada a /api/auth/login y /api/clientes

.env              # se crea manualmente (no se versiona)
````

---

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <carpeta_del_proyecto>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear la base de datos (script `bd/healthy_food.sql`)

Dentro del proyecto tienes el archivo:

```text
bd/healthy_food.sql
```

Este script:

* Crea la base de datos `HealthyFood`.

* Crea la tabla `clientes`.

* Crea el resto de tablas de e-commerce:

  * `direcciones`
  * `categorias`
  * `productos` (incluye campos nutricionales: calorías, proteínas, etc.)
  * `carritos` y `carrito_items`
  * `pedidos` y `pedido_items`
  * `pagos`

* Inserta un cliente demo con contraseña hasheada (para pruebas).

#### Opción A: usar CLI de MySQL

Desde la carpeta raíz del proyecto:

```bash
mysql -u <tu_usuario> -p < ./bd/healthy_food.sql
```

Te pedirá la contraseña del usuario de MySQL y ejecutará todo el script.

#### Opción B: usar Workbench / HeidiSQL

1. Abrir tu cliente (Workbench, HeidiSQL, etc.).
2. Conectarte al servidor de MySQL.
3. Abrir el archivo `bd/healthy_food.sql`.
4. Ejecutar todo el script.

Al terminar, deberías tener:

* Base de datos: `HealthyFood`
* Tablas: `clientes`, `categorias`, `productos`, etc.
* Un registro de cliente demo (con contraseña ya hasheada).

---

### 4. Crear archivo `.env`

En la raíz del proyecto, crea un archivo llamado **`.env`** con contenido similar a:

```env
# Servidor HTTP
PORT=3000

# Base de datos MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=TU_USUARIO
MYSQL_PASSWORD=TU_PASSWORD
MYSQL_DB=HealthyFood
MYSQL_CONN_LIMIT=10

# Autenticación JWT
JWT_SECRET=UN_SECRETO_LARGO_Y_ALEATORIO_AQUI
JWT_EXPIRES_IN=1h
```

> 🔐 **Importante:**
>
> * No subas tu `.env` a GitHub.
> * Cambia `JWT_SECRET` por una cadena larga y difícil de adivinar.

---

## 🚀 Ejecución

### Desarrollo (con recarga automática)

```bash
npm run dev
```

La API escuchará (por defecto) en:

```text
http://localhost:3000/
```

### Producción / ejecución simple

```bash
npm start
# o, según tu configuración:
node src/server.js
```

---

## 🔌 Endpoints Principales

### Health

* `GET /`
  Respuesta rápida para saber si la API está viva.

* `GET /api/health`
  Devuelve algo como:

```json
{
  "status": "ok",
  "time": "2025-11-21T..."
}
```

---

### Autenticación

#### `POST /api/auth/login`

Permite hacer login con email y contraseña, y devuelve un **JWT**.

**Body JSON:**

```json
{
  "email": "demo@example.com",
  "password": "12345678"
}
```

> El usuario `demo@example.com` se crea con el script `bd/healthy_food.sql`.
> La contraseña en texto plano para pruebas es `12345678`.

**Respuesta exitosa:**

```json
{
  "token": "JWT_AQUI",
  "user": {
    "id": 1,
    "nombre": "Cliente Demo",
    "email": "demo@example.com"
  }
}
```

Usa este `token` en las rutas protegidas así:

```http
Authorization: Bearer JWT_AQUI
```

---

### Clientes (protegido con JWT)

Todas las rutas de `/api/clientes` requieren encabezado:

```http
Authorization: Bearer <tu_token_jwt>
```

#### `GET /api/clientes`

Lista paginada de clientes.

Query params opcionales:

* `limit` (por defecto 50)
* `offset` (por defecto 0)

Ejemplo:

```http
GET /api/clientes?limit=10&offset=0
Authorization: Bearer <token>
```

Respuesta:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Cliente Demo",
      "email": "demo@example.com",
      "activo": 1,
      "createdAt": "2025-11-21T...",
      "updatedAt": "2025-11-21T..."
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "count": 1
  }
}
```

#### `GET /api/clientes/:id`

Obtiene un cliente por su ID.

```http
GET /api/clientes/1
Authorization: Bearer <token>
```

#### `POST /api/clientes`

Crea un nuevo cliente.

```http
POST /api/clientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Cliente",
  "email": "nuevo@example.com",
  "password": "unaClave123",
  "activo": true
}
```

#### `PATCH /api/clientes/:id`

Actualiza parcialmente los datos de un cliente.

```http
PATCH /api/clientes/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nombre Actualizado"
}
```

#### `DELETE /api/clientes/:id`

Elimina un cliente.

```http
DELETE /api/clientes/1
Authorization: Bearer <token>
```

---

### Categorías (protegido con JWT)

CRUD para el catálogo de categorías de productos saludables (ej. “Ensaladas”, “Smoothies”, “Snacks Fit”…).

Todas las rutas de `/api/categorias` requieren:

```http
Authorization: Bearer <tu_token_jwt>
```

#### `GET /api/categorias`

Lista paginada de categorías.

Query params opcionales:

* `limit` (por defecto 50)
* `offset` (por defecto 0)

```http
GET /api/categorias?limit=20&offset=0
Authorization: Bearer <token>
```

Ejemplo de respuesta:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Ensaladas",
      "descripcion": "Opciones frescas y ligeras",
      "activa": 1,
      "createdAt": "2025-11-21T...",
      "updatedAt": "2025-11-21T..."
    }
  ],
  "meta": {
    "limit": 20,
    "offset": 0,
    "count": 1
  }
}
```

#### `GET /api/categorias/:id`

Obtiene una categoría por ID.

```http
GET /api/categorias/1
Authorization: Bearer <token>
```

#### `POST /api/categorias`

Crea una nueva categoría.

```http
POST /api/categorias
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Smoothies",
  "descripcion": "Bebidas saludables y energéticas",
  "activa": true
}
```

#### `PATCH /api/categorias/:id`

Actualiza parcialmente una categoría.

```http
PATCH /api/categorias/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "descripcion": "Smoothies frutales y verdes"
}
```

#### `DELETE /api/categorias/:id`

Elimina (o marca como inactiva, dependiendo de la implementación) una categoría.

```http
DELETE /api/categorias/1
Authorization: Bearer <token>
```

---

### Productos (protegido con JWT)

CRUD de productos del catálogo, asociados a una categoría y con campos nutricionales opcionales.

Todas las rutas de `/api/productos` requieren:

```http
Authorization: Bearer <tu_token_jwt>
```

#### `GET /api/productos`

Lista de productos (opcionalmente paginada, filtrada por categoría).

Parámetros de query frecuentes:

* `limit` (por defecto 50)
* `offset` (por defecto 0)
* `categoriaId` (opcional: filtra por categoría)

```http
GET /api/productos?limit=10&offset=0&categoriaId=1
Authorization: Bearer <token>
```

Respuesta típica:

```json
{
  "data": [
    {
      "id": 10,
      "categoriaId": 1,
      "nombre": "Ensalada César Light",
      "descripcion": "Versión ligera con aderezo bajo en grasa",
      "precio": 120.00,
      "stock": 15,
      "urlImagen": "https://.../ensalada-cesar.jpg",
      "activo": 1,
      "calorias": 280,
      "proteinas": 18,
      "carbohidratos": 20,
      "grasas": 10,
      "esVegano": 0,
      "esSinGluten": 1,
      "createdAt": "2025-11-21T...",
      "updatedAt": "2025-11-21T..."
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "count": 1
  }
}
```

#### `GET /api/productos/:id`

Obtiene un producto por ID.

```http
GET /api/productos/10
Authorization: Bearer <token>
```

#### `POST /api/productos`

Crea un nuevo producto.

```http
POST /api/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoriaId": 1,
  "nombre": "Bowl de Quinoa y Verduras",
  "descripcion": "Quinoa, brócoli, zanahoria, hummus",
  "precio": 145.50,
  "stock": 20,
  "urlImagen": "https://.../quinoa-bowl.jpg",
  "activo": true,
  "calorias": 350,
  "proteinas": 16,
  "carbohidratos": 40,
  "grasas": 12,
  "esVegano": true,
  "esSinGluten": true
}
```

#### `PATCH /api/productos/:id`

Actualiza parcialmente un producto.

```http
PATCH /api/productos/10
Authorization: Bearer <token>
Content-Type: application/json

{
  "precio": 149.90,
  "stock": 18,
  "activo": true
}
```

#### `DELETE /api/productos/:id`

Elimina (o desactiva) un producto.

```http
DELETE /api/productos/10
Authorization: Bearer <token>
```

> 💡 **Nota:**
> Internamente puedes optar por un borrado lógico (`activo = 0`) en lugar de un `DELETE` real, para no perder historial de pedidos.

---

## 🖥️ Frontend de prueba (login + registro)

En la carpeta `public/` viene un mini frontend estático para probar la autenticación y creación de clientes sin necesidad de Postman:

* `GET /` → sirve `public/index.html` con:

  * Formulario de **login** que llama a `POST /api/auth/login`.
  * Formulario de **registro** que llama a `POST /api/clientes`.
* Usa `localStorage` para guardar el **JWT** y los datos básicos del usuario.

Es solo una interfaz de ejemplo / demo para trabajar contra la API; en un proyecto real podrías reemplazarlo por un frontend en React, Vue, Angular, etc.

---

## 👤 Autor

Cristian Iván Vázquez Gómez

```
```
