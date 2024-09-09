-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS WhatsappLedasCallCenter;

-- Usar la base de datos
USE WhatsappLedasCallCenter;

-- Crear tabla estados si no existe
CREATE TABLE IF NOT EXISTS estados (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Crear tabla carreras si no existe
CREATE TABLE IF NOT EXISTS carreras (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Crear tabla servicios si no existe
CREATE TABLE IF NOT EXISTS servicios (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Crear tabla datos_personales si no existe
CREATE TABLE IF NOT EXISTS datos_personales (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  fecha_ingreso_meta DATE DEFAULT NULL,
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(255) NOT NULL,
  carrera_id CHAR(36) NOT NULL,
  estado_id CHAR(36) NOT NULL,
  servicio_id CHAR(36) NOT NULL,
  enviado BOOLEAN NOT NULL,
  fecha_envio_wha DATE DEFAULT NULL,
  CONSTRAINT fk_carrera_id FOREIGN KEY (carrera_id) REFERENCES carreras(id),
  CONSTRAINT fk_estado_id FOREIGN KEY (estado_id) REFERENCES estados(id),
  CONSTRAINT fk_servicio_id FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);