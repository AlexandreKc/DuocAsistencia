****
<h1 style="text-align: center;">Archivo README AsistApp</h1>

<h3 style="text-align: center;">DESCRIPCIÓN</h3>
 AsistApp es una aplicación que tiene por objetivo facilitar los registros de asistencia dentro de un contexto de pandemia, donde los estudiantes utilizan mascarillas todo su horario escolar y por ende los profesores se ven dificultades al momento de oírlos y distinguirlos. Consiste en una aplicación por la cual los docentes realizan un código QR, los alumnos deben ingresar por medio de sus cuentas personales y escanear el QR por medio de la opción de escaneo y finalmente el sistema registra la asistencia del alumno.

---

<h3 style="text-align: center;">LIBRERÍAS</h3>

1.-@ionic/angular: Para desarrollar aplicaciones utilizando Ionic.

2.-@angular/material: Para acceder a componentes de Material Design.

3.-html5-qrcode: es una biblioteca JavaScript ligera que permite leer códigos QR utilizando la cámara de un dispositivo directamente desde el navegador.\
**Instalación:**\
Primero se escribe en la terminal:\
```npm install html5-qrcode```\
Luego se importa en componentes\
```import { Html5Qrcode } from "html5-qrcode";```

**Evidencia de uso:** en escanear.page.ts

![qrcode1](src/assets/icon/image.png)

![qrcode2](src/assets/icon/image-1.png)

-Para instalar las librerías necesarias, usa el siguiente comando en la terminal:\
```npm install```

---

<h3 style="text-align: center;">APIs</h3>
Api del clima:
Open-Meteo es una API meteorológica de código abierto y ofrece acceso gratuito para uso no comercial(open-meteo.com).


**Parámetros:**\
Los parámetros de consulta son:\
```latitude=52.52:``` Especifica la latitud de la ubicación para la cual se desea obtener el clima.\
```longitude=13.41:``` Especifica la longitud de la ubicación.\
```current=temperature_2m,wind_speed_10m:``` Indica que deseas recibir datos actuales de temperatura a 2 metros de altura y velocidad del viento a 10 metros de altura.\
```hourly=temperature_2m,relative_humidity_2m,wind_speed_10m:``` Especifica que deseas recibir datos horarios de temperatura, humedad relativa y velocidad del viento.\
Los parámetros de respuesta:\
Datos Actual (current):\
```time:``` La hora a la que se registraron los datos actuales.\
```temperature_2m:``` La temperatura actual a 2 metros de altura.\
```wind_speed_10m```: La velocidad del viento actual a 10 metros de altura.\
Datos Horarios (hourly):\
```time:``` Una lista de tiempos (fechas y horas) para los cuales se registraron los datos horarias.\
```wind_speed_10m:``` Un array que contiene la velocidad del viento para cada hora correspondiente.\
```temperature_2m:``` Un array que muestra la temperatura registrada a 2 metros de altura para cada hora.\
```relative_humidity_2m:``` Un array que proporciona la humedad relativa a 2 metros de altura para cada hora.

**Evidencia de uso:**

![apiclima1](src/assets/icon/image-2.png)

![alt text](src/assets/icon/image-3.png)

![alt text](src/assets/icon/image-8.png)

---
<h3 style="text-align: center;">PLUGINS</h3>


1.-capacitor/network: es un network pluging, el cual detecta el estado de la red (en linea o fuera de línea) y el tipo de conexión.\
Se instala en la terminal:\
```npm install @capacitor/network```\
Evidencia de uso:

![plugin1](src/assets/icon/image-5.png)

![alt text](src/assets/icon/image-6.png)

![alt text](src/assets/icon/image-7.png)

---
<h3 style="text-align: center;">TESTING Y APK</h3>


Durante el proceso de testing utilizamos Jasmine para realizar diversas pruebas.
![jasmine](src/assets/icon/image-4.png)

---
<h3 style="text-align: center;">PUBLICACION DE LA APP</h3>
**PUBLICACIÓN de la App:**(Incluye en el archivo README.md la evidencia del comando utilizado para la firma, especificando el nombre y ubicación del archivo generado.)
