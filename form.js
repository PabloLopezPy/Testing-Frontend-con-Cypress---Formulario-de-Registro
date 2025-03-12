describe('Formulario de Registro', () => {
    beforeEach(() => {
      cy.visit('/registro.html');
    });
  
    // Test de carga de página
    it('debe cargar el formulario correctamente', () => {
      cy.get('form').should('be.visible');
      cy.get('input[name="nombre"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="confirmPassword"]').should('exist');
      cy.get('input[name="fechaNacimiento"]').should('exist');
      cy.get('input[name="terminos"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
  
    // Tests de validación de campos obligatorios
    it('debe mostrar errores para campos obligatorios vacíos', () => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-error="nombre"]').should('be.visible');
      cy.get('[data-error="email"]').should('be.visible');
      cy.get('[data-error="password"]').should('be.visible');
      cy.get('[data-error="terminos"]').should('be.visible');
    });
  
    // Test de validación de formato de correo electrónico
    it('debe validar formato de correo electrónico', () => {
      cy.get('input[name="email"]').type('correo-invalido');
      cy.get('input[name="email"]').blur();
      cy.get('[data-error="email"]').should('be.visible');
      cy.get('[data-error="email"]').should('contain', 'formato válido');
      
      cy.get('input[name="email"]').clear().type('correo@valido.com');
      cy.get('input[name="email"]').blur();
      cy.get('[data-error="email"]').should('not.be.visible');
    });
  
    // Test de validación de requisitos de contraseña
    it('debe validar requisitos de contraseña', () => {
      cy.get('input[name="password"]').type('abc123');
      cy.get('input[name="password"]').blur();
      cy.get('[data-error="password"]').should('be.visible');
      
      cy.get('input[name="password"]').clear().type('Abc12345');
      cy.get('input[name="password"]').blur();
      cy.get('[data-error="password"]').should('not.be.visible');
    });
  
    // Test de coincidencia de contraseñas
    it('debe verificar coincidencia de contraseñas', () => {
      cy.get('input[name="password"]').type('Abc12345');
      cy.get('input[name="confirmPassword"]').type('Abc123456');
      cy.get('input[name="confirmPassword"]').blur();
      cy.get('[data-error="confirmPassword"]').should('be.visible');
      
      cy.get('input[name="confirmPassword"]').clear().type('Abc12345');
      cy.get('input[name="confirmPassword"]').blur();
      cy.get('[data-error="confirmPassword"]').should('not.be.visible');
    });
  
    // Test de habilitación/deshabilitación del botón de envío
    it('debe habilitar el botón de envío solo cuando todos los campos requeridos son válidos', () => {
      // Inicialmente el botón debe estar deshabilitado
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Llenar todos los campos correctamente
      cy.get('input[name="nombre"]').type('Juan Pérez');
      cy.get('input[name="email"]').type('juan@example.com');
      cy.get('input[name="password"]').type('Password123');
      cy.get('input[name="confirmPassword"]').type('Password123');
      cy.get('input[name="terminos"]').check();
      
      // El botón ahora debe estar habilitado
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  
    // Test de flujo completo
    it('debe completar el registro exitosamente', () => {
      cy.get('input[name="nombre"]').type('Juan Pérez');
      cy.get('input[name="email"]').type('juan@example.com');
      cy.get('input[name="password"]').type('Password123');
      cy.get('input[name="confirmPassword"]').type('Password123');
      cy.get('input[name="fechaNacimiento"]').type('1990-01-01');
      cy.get('input[name="terminos"]').check();
      
      cy.get('button[type="submit"]').click();
      
      // Verificar redirección a página de confirmación
      cy.url().should('include', '/confirmacion.html');
      
      // Verificar contenido de la página de confirmación
      cy.get('h1').should('contain', 'Bienvenido');
      cy.get('.user-info').should('contain', 'Juan Pérez');
      cy.get('.user-info').should('contain', 'juan@example.com');
    });
  
    // Tests de casos extremos
    it('debe manejar valores límite y caracteres especiales', () => {
      // Probar con un nombre muy largo
      const nombreLargo = 'A'.repeat(100);
      cy.get('input[name="nombre"]').type(nombreLargo);
      cy.get('input[name="nombre"]').blur();
      cy.get('[data-error="nombre"]').should('not.be.visible');
      
      // Probar caracteres especiales en el email
      cy.get('input[name="email"]').type('user+test.special_chars@example-domain.co.uk');
      cy.get('input[name="email"]').blur();
      cy.get('[data-error="email"]').should('not.be.visible');
      
      // Probar contraseña con caracteres especiales
      cy.get('input[name="password"]').type('P@$$w0rd123!');
      cy.get('input[name="confirmPassword"]').type('P@$$w0rd123!');
      cy.get('input[name="password"]').blur();
      cy.get('input[name="confirmPassword"]').blur();
      cy.get('[data-error="password"]').should('not.be.visible');
      cy.get('[data-error="confirmPassword"]').should('not.be.visible');
    });
  
    // Test de prevención de inyección XSS
    it('debe manejar intentos básicos de inyección de scripts', () => {
      // Probar script básico en el campo de nombre
      cy.get('input[name="nombre"]').type('<script>alert("XSS")</script>');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('Password123');
      cy.get('input[name="confirmPassword"]').type('Password123');
      cy.get('input[name="terminos"]').check();
      
      cy.get('button[type="submit"]').click();
      
      // Verificar que se redirige a la página de confirmación (el script no bloqueó el envío)
      cy.url().should('include', '/confirmacion.html');
      
      // Verificar que el script se muestra como texto y no se ejecuta
      cy.get('.user-info').should('contain', '<script>');
    });
  });