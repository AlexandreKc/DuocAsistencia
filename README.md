# DuocAsistencia
Repositorio para evaluación de Programación aplicaciones móviles.

La cual es una aplicación móvil que permite a los estudiantes registrar su propia asistencia, a través de la lectura de un código QR generado por el docente.

## Requisitos previos 

Telefono móvil con OS Android 7.0 o superior

## Instalación

Descarga la apk desde nuestro sitio web https://gleaming-cascaron-b1f24c.netlify.app/


##Funcionamiento

Aplicación móvil dependiente de un repositorio externo que se ejecutar por medio de un servidor el cual realiza solicitudes (Este protege las credenciales). Al realizar una solicitud el servidor externo realiza
un llamado una base de datos configurada en PhP Admin, que también es remota, Esta se encarga de devolver datos.

**Backend: https://github.com/AlexandreKc/Backend_assistapp - Ejecutado en RailWay

**Base de datos: Ejecutada en FreeMySQLHosting

**Pagina web: Hosteada en netlify con el repositorio https://github.com/AlexandreKc/AsistAppLandingPage (Privado)

