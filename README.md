<p align="center">
  <a href="https://universitariadecolombia.edu.co/" target="blank"><img src="./images/Logo_universitaria.png" width="" alt="Logo Universitaria de colombia" /></a>
</p>

<p align="center">Servidor <a href="http://nodejs.org" target="_blank">Node.js</a> Construido para la gestion de leads</p>

<p align="center">
  <a href="https://www.facebook.com/universitariadecolombia0" target="_blank">
    <img src="https://img.shields.io/badge/Facebook-Universidad%20de%20Colombia-blue?style=flat&logo=facebook" alt="Facebook" />
  </a>
  <a href="https://www.instagram.com/universitaria_oficial/" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-Universidad%20de%20Colombia-pink?style=flat&logo=instagram" alt="Instagram" />
  </a>
  <a href="https://www.tiktok.com/@universitariadecolombia" target="_blank">
    <img src="https://img.shields.io/badge/TikTok-Universidad%20de%20Colombia-black?style=flat&logo=tiktok" alt="TikTok" />
  </a>
</p>

---

## Desarrollador

[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/camilosolanorodriguez/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/camilosolanoro/)
[![Sitio Web](https://img.shields.io/badge/Camilo-000000?style=for-the-badge&logo=google-chrome&logoColor=white)](http://camilosolanorodriguez.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Camilocsr)


## Tabla de contenido. 📑

- [Description](#description) 📝
- [Installation](#installation) 🛠️
- [Estructura](#estructura) 🏗️
- [Configuarciones](#configuarciones) ⚙️
- [Softwares](#softwares) ⚙️
- [Dependencias](#dependencias) 📦

---

# WhatsBulkSender

**WhatsBulkSender** Este aplicativo hace parte de una serie de aplicativos los cuales funcionan en conjunto para hacer la gestion de leads de una empresa en este caso [Universitaria de Colombia](https://universitariadecolombia.edu.co/)

## Funcionamiento
- Este aplicativo se encarga de filtrar leads ingresados por medio de un excel.
- Se lee el excel y se agrega cada lead a un json temporal.
- En el json los numeros de telefonos son verificados para saber si son numeros colombianos validos.
> [!NOTE]
> **Ejemplo:** 573*********
- Almacenamos los leads en una base de datos relacional para una mejor gestion y rapides del aplicativo.

## **Características Principales**

### 🚀 Envío Individual
- **Funcionalidad:** Permite enviar mensajes personalizados a clientes individuales utilizando un formulario simple y fácil de usar.
- **Uso Ideal:** Comunicación rápida y personalizada para respuestas inmediatas o mensajes específicos.

### 📊 Envío Masivo
- **Funcionalidad:** Soporta la carga de archivos Excel con listas de múltiples clientes, permitiendo el envío de mensajes a gran escala.
- **Uso Ideal:** Campañas de marketing, anuncios de productos o mensajes informativos a una base de datos extensa de clientes.

### Detalles de la Base de Datos de Clientes
- **Carreras**:  
  Esta tabla se creo con el fin de almacenar en ella de manera normalisada las carreras a las cuales los leads pueden llegar a estar interesados:
  - **id**
  - **nombre**
  
- **Estados**:  
  Esta tabla se creo con el fin de almacenar el estado del lead con esto quiero decir que tan fuerte es el interes del lead en comparar nuestros servicios:
  - **id**
  - **nombre**
  
- **servicios**:  
  Esta tabla se creo con el fin de alamcenar los tipos de cervicios los cuales se encargan de las ventas en la empresa:
  - **id**
  - **nombre**
  
- **datos_personales**:  
  Esta tabla se creo con el fin de almacenar los datos del lead que se ingreso al aplicativo y esta es la tabla la cual se relaciona con las demas:
  - **id**.
  - **fecha_ingreso_meta** este campo representa el dia de ingreso del leads a los formularios de campañas de la empresa.
  - **nombres**
  - **apellidos**
  - **correo**
  -  **telefono**
  -  **carrera_id** este campo es la llave foranea de la tabla carreras
  -  **estado_id** este campo es la llave foranea de la tabla estados
  -  **servicio_id** este campo es la llave foranea de la tabla servicios

### Configura la Base de Datos
- El archivo SQL necesario para configurar la base de datos se encuentra en la carpeta [Base de datos sql](config/DB/DB.SQL) en la raíz del proyecto.
- Ejecuta el archivo `DB.sql` para crear la base de datos y las tablas necesarias.