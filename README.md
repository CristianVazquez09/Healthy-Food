# Heathy Food 

API base con **Express** usando patrón **MVC** (+ capa de **servicios** y **repositorios**), validación con **Zod** y acceso a datos con **mysql2/promise**.

---

## Stack

* Node.js (ESM)
* Express 5
* mysql2/promise (pool + prepared statements)
* Zod (validación de entrada)
* Nodemon (dev)

---

## Requisitos

* **Node.js** ≥ 18
* **MySQL** 8.x o **MariaDB** equivalente (servicio corriendo)
* Opcional: **MySQL Workbench** / **HeidiSQL** si prefieres GUI

---

## Estructura del proyecto

```
src/
  app.js
  server.js
  routes/
    index.js
    socios.routes.js
  controllers/
    socio.controller.js
  services/
    socio.service.js
  repositories/
    socio.repository.js
  models/
    socio.model.js
  middlewares/
    errorHandler.js
    notFound.js
  utils/
    db.js
scripts/
  db-init.js
.env
```

---

## Variables de entorno (`.env`)

Ejemplo mínimo (TCP):

```
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=mi_api
MYSQL_CONN_LIMIT=10
```

---


## Inicializar Base de Datos.

### SQL manual (Workbench/HeidiSQL/CLI)

Ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS mi_api
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE mi_api;

CREATE TABLE IF NOT EXISTS socios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE INDEX idx_socios_created_at ON socios (created_at);
```

---

## Ejecutar
Instalar Dependencias:

```bash
npm install
```
Desarrollo (con recarga):

```bash
npm run dev
```

Producción (compilación no requerida en este boilerplate):

```bash
npm start
```

La API escuchará en: `http://localhost:3000/`

---

## Endpoints (implementados)

### Health

* `GET /api/health` → `{ status: "ok", time: "..." }`

### Socios

* `GET /api/socios?limit=50&offset=0` → Lista paginada
* `POST /api/socios` → Crea un socio

    * **Body JSON**

      ```json
      {
        "nombre": "Carla López",
        "email": "carla@example.com",
        "activo": true
      }
      ```

> Próximos (si usas el servicio/repo ya listos): `GET /api/socios/:id`, `PATCH /api/socios/:id`, `DELETE /api/socios/:id`.

---

## Autor

Cristian Ivan Vazquez Gomez
