describe('Pruebas Avanzadas del Formulario', () => {
    beforeEach(() => {
      cy.visit('/registro.html');
    });
  
    // Test de accesibilidad básica
    it('debe tener elementos adecuadamente etiquetados', () => {
      // Verificar que todos los campos tienen atributos "for" y "id" correspondientes
      cy.get('label[for="nombre"]').should('exist');
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="password"]').should('exist');
      cy.get('label[for="confirmPassword"]').should('exist');
      cy.get('label[for="fechaNacimiento"]').should('exist');
      cy.get('label[for="terminos"]').should('exist');
      
      // Verificar que los inputs requeridos tienen el atributo "required"
      cy.get('input#nombre').should('have.attr', 'required');
      cy.get('input#email').should('have.attr', 'required');
      cy.get('input#password').should('have.attr', 'required');
      cy.get('input#confirmPassword').should('have.attr', 'required');
      cy.get('input#terminos').should('have.attr', 'required');
    });
    
    // Test de navegación con teclado
    it('debe ser navegable con teclado', () => {
      // Comprobar que se puede tabular a través de todos los campos
      cy.get('input#nombre').focus().tab()
        .focused().should('have.attr', 'id', 'email').tab()
        .focused().should('have.attr', 'id', 'password').tab()
        .focused().should('have.attr', 'id', 'confirmPassword').tab()
        .focused().should('have.attr', 'id', 'fechaNacimiento').tab()
        .focused().should('have.attr', 'id', 'terminos').tab()
        .focused().should('have.attr', 'id', 'submitBtn');
    });
    
    // Test de mensajes de error específicos
    it('debe mostrar mensajes de error específicos y claros', () => {
      // Verificar mensaje de error para email inválido
      cy.get('input#email').type('correo.invalido').blur();
      cy.get('[data-error="email"]')
        .should('be.visible')
        .and('contain', 'formato válido');
      
      // Verificar mensaje de error para contraseña débil
      cy.get('input#password').type('123').blur();
      cy.get('[data-error="password"]')
        .should('be.visible')
        .and('contain', 'al menos 8 caracteres');
      
      // Verificar mensaje de error para contraseñas que no coinciden
      cy.get('input#password').clear().type('Password123');
      cy.get('input#confirmPassword').type('Password321').blur();
      cy.get('[data-error="confirmPassword"]')
        .should('be.visible')
        .and('contain', 'no coinciden');
    });
    
    // Test de persistencia de datos
    it('debe guardar y recuperar datos correctamente en localStorage', () => {
      const testData = {
        nombre: 'Ana Torres',
        email: 'ana.torres@example.com',
        fechaNacimiento: '1985-07-15'
      };
      
      // Completar y enviar el formulario
      cy.get('input#nombre').type(testData.nombre);
      cy.get('input#email').type(testData.email);
      cy.get('input#password').type('Clave123');
      cy.get('input#confirmPassword').type('Clave123');
      cy.get('input#fechaNacimiento').type(testData.fechaNacimiento);
      cy.get('input#terminos').check();
      cy.get('button[type="submit"]').click();
      
      // Verificar que se guardaron los datos correctamente
      cy.url().should('include', '/confirmacion.html');
      
      // Verificar los datos mostrados en la página coinciden con los ingresados
      cy.get('#userNameDisplay').should('have.text', testData.nombre);
      cy.get('#userEmail').should('have.text', testData.email);
      cy.get('#userBirthdate').should('have.text', testData.fechaNacimiento);
      
      // Verificar los datos almacenados en localStorage
      cy.window().then((win) => {
        const storedData = JSON.parse(win.localStorage.getItem('userData'));
        expect(storedData.nombre).to.equal(testData.nombre);
        expect(storedData.email).to.equal(testData.email);
        expect(storedData.fechaNacimiento).to.equal(testData.fechaNacimiento);
      });
    });
    
    // Test de comportamiento con diferentes dispositivos
    it('debe ser responsive', () => {
      // Verificar en tamaño móvil
      cy.viewport('iphone-6');
      cy.get('form').should('be.visible');
      cy.get('.container').should('have.css', 'max-width');
      
      // Verificar en tamaño tablet
      cy.viewport('ipad-2');
      cy.get('form').should('be.visible');
      
      // Verificar en tamaño desktop
      cy.viewport(1200, 800);
      cy.get('form').should('be.visible');
    });
    
    // Test de manejo de errores lógicos introducidos
    it('debe manejar errores lógicos introducidos intencionalmente', () => {
      // Simulando un error lógico: enviar el formulario cuando hay errores
      // A pesar de llenar todos los campos, dejamos el email con formato inválido
      cy.get('input#nombre').type('Prueba Error Lógico');
      cy.get('input#email').type('email-invalido');  // Email con formato inválido
      cy.get('input#password').type('Password123');
      cy.get('input#confirmPassword').type('Password123');
      cy.get('input#terminos').check();
      
      // El botón de envío debería estar deshabilitado debido al email inválido
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Forzar un click en el botón (simulando un bypass del disabled)
      cy.get('button[type="submit"]').invoke('removeAttr', 'disabled').click({force: true});
      
      // El formulario no debería enviarse (comprobamos que seguimos en la misma página)
      cy.url().should('include', '/registro.html');
      
      // Corregir el error y verificar que ahora sí funciona
      cy.get('input#email').clear().type('correcto@email.com');
      cy.get('input#email').blur();
      
      // Ahora el botón debe estar habilitado
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').click();
      
      // Verificamos que se ha redirigido correctamente
      cy.url().should('include', '/confirmacion.html');
    });
    
    // Test de ciclo de desarrollo guiado por pruebas
    it('debe ilustrar el ciclo de desarrollo guiado por pruebas', () => {
      // Este test simula un requisito nuevo: añadir una opción para newsletter
      
      // 1. Primero escribimos el test (que fallará)
      cy.get('input#newsletter').should('exist');
      
      // 2. Luego implementamos la característica en el código (simulado aquí)
      // Esto debería estar en el HTML pero lo simulamos añadiendo el elemento dinámicamente
      cy.document().then((doc) => {
        const checkboxDiv = doc.createElement('div');
        checkboxDiv.className = 'form-group checkbox';
        checkboxDiv.innerHTML = `
          <input type="checkbox" id="newsletter" name="newsletter">
          <label for="newsletter">Suscribirse al newsletter</label>
        `;
        
        // Insertar antes del botón de envío
        const submitButton = doc.querySelector('button[type="submit"]').parentNode;
        submitButton.parentNode.insertBefore(checkboxDiv, submitButton);
      });
      
      // 3. Ahora verificamos que el test pasa
      cy.get('input#newsletter').should('exist');
      cy.get('input#newsletter').check().should('be.checked');
    });
  });