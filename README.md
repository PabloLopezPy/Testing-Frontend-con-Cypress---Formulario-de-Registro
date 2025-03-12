# Proyecto de Formulario de Registro con Cypress Testing

Este proyecto implementa un formulario de registro para una aplicación web con validaciones en el lado del cliente y pruebas automatizadas utilizando Cypress.

## Características

- Formulario de registro completo con validaciones en tiempo real
- Requisitos de contraseña seguros
- Interfaz de usuario intuitiva con mensajes de error claros
- Página de confirmación de registro
- Suite completa de pruebas automatizadas con Cypress

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (viene con Node.js)

## Instalación

1. Crea una carpeta para el proyecto:
   ```
   mkdir proyecto-cypress-testing
   cd proyecto-cypress-testing
   ```

2. Inicializa el proyecto npm:
   ```
   npm init -y
   ```

3. Instala Cypress como dependencia de desarrollo:
   ```
   npm install cypress --save-dev
   ```

4. Instala webpack y el servidor de desarrollo:
   ```
   npm install webpack webpack-cli webpack-dev-server --save-dev
   ```

5. Agrega los scripts necesarios al package.json:
   ```json
   "scripts": {
     "cy:open": "cypress open",
     "dev": "webpack serve --mode development"
   }
   ```

6. Inicializa Cypress:
   ```
   npx cypress open
   ```

7. Sigue las instrucciones en pantalla para configurar Cypress para pruebas E2E.


```

## Ejecución del proyecto

1. Para iniciar el servidor de desarrollo:
   ```
   npm run dev
   ```

2. Abre tu navegador y visita:
   ```
   http://localhost:8080
   ```

3. Para abrir la interfaz de Cypress:
   ```
   npm run cy:open
   ```

4. En Cypress, selecciona "E2E Testing", elige un navegador y haz clic en "Start E2E Testing".

5. Selecciona uno de los archivos de prueba (form.cy.js o advanced.cy.js) para ejecutar las pruebas.

## Validaciones implementadas

- Nombre completo (campo obligatorio)
- Correo electrónico (obligatorio, con validación de formato)
- Contraseña (obligatoria, mínimo 8 caracteres, debe incluir al menos una letra mayúscula, una minúscula y un número)
- Confirmación de contraseña (debe coincidir con la contraseña)
- Fecha de nacimiento (opcional)
- Términos y condiciones (checkbox obligatorio)

## Pruebas implementadas

### Pruebas básicas (form.cy.js)
- Verificación de carga del formulario
- Validación de campos obligatorios
- Validación de formato de correo electrónico
- Validación de requisitos de contraseña
- Verificación de coincidencia de contraseñas
- Habilitación/deshabilitación del botón de envío
- Flujo completo de registro exitoso
- Manejo de valores límite y caracteres especiales
- Prevención básica de inyección XSS

### Pruebas avanzadas (advanced.cy.js)
- Verificación de accesibilidad básica
- Navegación con teclado
- Mensajes de error específicos y claros
- Persistencia de datos en localStorage
- Comportamiento responsive en diferentes dispositivos
- Manejo de errores lógicos
- Ejemplo de ciclo TDD

## Consideraciones de diseño

- **UX/UI**: Diseño limpio y minimalista para mejorar la experiencia del usuario
- **Validación en tiempo real**: Proporciona feedback inmediato al usuario
- **Accesibilidad**: Elementos correctamente etiquetados y navegables por teclado
- **Seguridad**: Validaciones para prevenir inyecciones básicas y requisitos de contraseña seguros
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## Explicación de las pruebas

### form.cy.js
Este archivo contiene las pruebas básicas del formulario:
- Carga del formulario
- Validación de campos obligatorios
- Formato de correo electrónico
- Requisitos de contraseña
- Coincidencia de contraseñas
- Prueba de flujo completo

### advanced.cy.js
Este archivo contiene pruebas más avanzadas:
- Accesibilidad
- Navegación por teclado
- Mensajes de error específicos
- Persistencia de datos
- Responsive design
- Manejo de errores lógicos
- Simulación de ciclo TDD

