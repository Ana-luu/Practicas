CREATE DATABASE proyecto_web;
USE proyecto_web;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE catedraticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    curso_id INT,
    catedratico_id INT,
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id),
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id)
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    publicacion_id INT,
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id)
);

CREATE TABLE cursos_aprobados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    curso_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

SHOW TABLES;

