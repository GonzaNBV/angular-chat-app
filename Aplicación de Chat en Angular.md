# Trabajo Práctico – Clon de Chat en Angular

## ¿De qué trata este proyecto?

Este proyecto fue realizado para la materia **Desarrollo en Angular**.  
Consiste en una aplicación web que simula un chat, utilizando especialidades
médicas como si fueran contactos, de manera similar a una aplicación de
mensajería como WhatsApp.

No es un sistema médico real. La temática médica se usa únicamente como ejemplo
para representar conversaciones independientes dentro de la aplicación.

---

## ¿Cómo se usa la aplicación?

Al ingresar a la aplicación se muestra una pantalla de inicio con un botón
llamado **“Comenzar Consulta”**.

Al presionar ese botón:
- Se accede a una lista de especialidades médicas.
- Cada especialidad funciona como un chat independiente.
- Al seleccionar una especialidad se abre su conversación.
- El usuario puede enviar mensajes y la aplicación responde automáticamente
  después de un pequeño retardo.

Cada especialidad mantiene su propio historial de mensajes, que no se pierde
al cambiar de chat.

---

## Diseño y pantallas

En pantallas grandes (computadora):
- Panel izquierdo: lista de especialidades.
- Panel central: conversación activa.
- Panel derecho: información del especialista.

En pantallas pequeñas (celular):
- El diseño se adapta para mostrar un panel a la vez, facilitando el uso
  en dispositivos móviles.

---

## Tecnologías utilizadas

- Angular 17
- TypeScript
- CSS nativo (Flexbox)
- Formularios reactivos
- Signals para manejo de estado
- Routing con provideRouter

---

## Organización del proyecto

El proyecto está organizado en las siguientes carpetas:

- **pages:** pantallas principales (home, especialidades, chat, consulta)
- **services:** lógica del funcionamiento del chat y manejo de mensajes
- **models:** interfaces de datos
- **components:** componentes reutilizables
- **shared.styles.css:** estilos compartidos entre chat y consulta

Esta organización permite mantener el código ordenado y evitar duplicación.

---

## Funcionalidades principales

- Creación automática de chats por especialidad
- Historial de mensajes independiente por cada chat
- Respuestas automáticas con retardo
- Validación de mensajes (campo obligatorio y máximo de caracteres)
- Mensajes alineados según el emisor
- Diseño responsive

---

## Rutas de la aplicación

- `/` > Pantalla de inicio
- `/especialidades` > Lista de chats
- `/especialidades/:id` > Conversación con la especialidad seleccionada
- `/consultas` > Vista alternativa de chats
- `/consultas/:id` > Conversación alternativa

**Nota:**  
La ruta `/especialidades/:id` cumple el mismo rol que la ruta `/chats/:id`
planteada en la consigna. En este proyecto se utiliza el nombre
“especialidades” porque cada chat representa una especialidad médica.

---

## Instalación y ejecución

Para ejecutar el proyecto localmente:

```bash
npm install
ng serve

Luego abrir en el navegador:
http://localhost:4200

```

---

## Alumno

Gonzalo Vidal  
Trabajo práctico – Angular 17
