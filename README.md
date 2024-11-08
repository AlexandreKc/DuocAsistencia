# DuocAsistencia
Repositorio para evaluación de Programación aplicaciones móviles.

La cual es una aplicación móvil que permite a los estudiantes registrar su propia asistencia, a través de la lectura de un código QR generado por el docente.

## Requisitos previos 

Tener instalado node.js y Ionic_CLI

## Instalación
Clona el repositorio y luego instala las dependencias

git clone DuocAsistencia
npm install
npm install cors

## Ejecutar la base de datos / Se abren dos terminales
Un terminal para ejecutar la página y otro para la base de datos.

En la terminal de la base de datos hay que hacer lo siguiente:
cd src
cd app
cd database
node server.js

En la terminal para ejecutar la página hay que hacer lo siguiente:
ionic serve

## Errores
Si existe algun error de mysql
npm install mysql2 --legacy-peer-deps

si forms da error en app.ts
npm install @angular/forms

actualizar npm si alguna dependencia da error
npm update

