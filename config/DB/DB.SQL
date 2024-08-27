CREATE DATABASE IF NOT EXISTS WhatsappLedasCallCenter;

USE WhatsappLedasCallCenter;

CREATE TABLE IF NOT EXISTS estados (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS carreras (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS datos_personales (
    id CHAR(36) PRIMARY KEY,
    fecha_ingreso_meta DATETIME DEFAULT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    carrera_id CHAR(36) NOT NULL,
    estado_id CHAR(36) NOT NULL,
    enviado BOOLEAN NOT NULL,
    fecha_envio_wha DATETIME,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id),
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

INSERT INTO estados (id, nombre) VALUES
    (UUID(), 'SIN GESTIONAR'),
    (UUID(), 'GESTIONADO'),
    (UUID(), 'INTERESADO');
