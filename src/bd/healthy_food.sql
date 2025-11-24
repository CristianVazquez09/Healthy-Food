-- =========================================================
-- HealthyFood: BD + tabla clientes + tablas e-commerce
-- Compatible con MySQL 8.x y MariaDB
-- =========================================================

-- 1) Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS `HealthyFood`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 2) Usar la base
USE `HealthyFood`;

-- 3) Crear tabla clientes (la tuya, sin cambios)
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clientes_email` (`email`),
  KEY `idx_clientes_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 4) Direcciones de envío
-- =========================================================
CREATE TABLE IF NOT EXISTS `direcciones` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `alias` VARCHAR(50) DEFAULT NULL,
  `calle` VARCHAR(150) NOT NULL,
  `numero_ext` VARCHAR(20) NOT NULL,
  `numero_int` VARCHAR(20) DEFAULT NULL,
  `colonia` VARCHAR(150) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(100) NOT NULL,
  `cp` VARCHAR(10) NOT NULL,
  `referencia` VARCHAR(255) DEFAULT NULL,
  `es_principal` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_direcciones_cliente_id` (`cliente_id`),
  CONSTRAINT `fk_direcciones_clientes`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 5) Categorías de productos
-- =========================================================
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `activa` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 6) Productos
-- =========================================================
CREATE TABLE IF NOT EXISTS `productos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoria_id` BIGINT UNSIGNED NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `url_imagen` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,

  -- Opcionales nutricionales (Healthy Food)
  `calorias` INT DEFAULT NULL,
  `proteinas` INT DEFAULT NULL,
  `carbohidratos` INT DEFAULT NULL,
  `grasas` INT DEFAULT NULL,
  `es_vegano` TINYINT(1) NOT NULL DEFAULT 0,
  `es_sin_gluten` TINYINT(1) NOT NULL DEFAULT 0,

  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_productos_categoria_id` (`categoria_id`),
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 7) Carritos
-- =========================================================
CREATE TABLE IF NOT EXISTS `carritos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_carritos_cliente_id` (`cliente_id`),
  CONSTRAINT `fk_carritos_clientes`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 8) Items de carrito
-- =========================================================
CREATE TABLE IF NOT EXISTS `carrito_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `carrito_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_carrito_items_carrito_id` (`carrito_id`),
  KEY `idx_carrito_items_producto_id` (`producto_id`),
  CONSTRAINT `fk_citems_carritos`
    FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_citems_productos`
    FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 9) Pedidos
-- =========================================================
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `direccion_envio_id` BIGINT UNSIGNED NOT NULL,
  `estado` ENUM('PENDIENTE','PAGADO','EN_PREPARACION','ENVIADO','ENTREGADO','CANCELADO')
           NOT NULL DEFAULT 'PENDIENTE',
  `total` DECIMAL(10,2) NOT NULL,
  `metodo_pago` ENUM('EFECTIVO','TARJETA','TRANSFERENCIA','OTRO')
                NOT NULL DEFAULT 'EFECTIVO',
  `observaciones` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pedidos_cliente_id` (`cliente_id`),
  KEY `idx_pedidos_direccion_envio_id` (`direccion_envio_id`),
  CONSTRAINT `fk_pedidos_clientes`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_direcciones`
    FOREIGN KEY (`direccion_envio_id`) REFERENCES `direcciones` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 10) Items de pedido
-- =========================================================
CREATE TABLE IF NOT EXISTS `pedido_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pedido_items_pedido_id` (`pedido_id`),
  KEY `idx_pedido_items_producto_id` (`producto_id`),
  CONSTRAINT `fk_pitems_pedidos`
    FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pitems_productos`
    FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 11) Pagos
-- =========================================================
CREATE TABLE IF NOT EXISTS `pagos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` BIGINT UNSIGNED NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `metodo_pago` ENUM('EFECTIVO','TARJETA','TRANSFERENCIA','OTRO') NOT NULL,
  `estado_pago` ENUM('PENDIENTE','APROBADO','RECHAZADO')
                NOT NULL DEFAULT 'PENDIENTE',
  `referencia_pasarela` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pagos_pedido_id` (`pedido_id`),
  CONSTRAINT `fk_pagos_pedidos`
    FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
