document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const form = document.getElementById('registroForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Campos del formulario
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const terminosCheckbox = document.getElementById('terminos');
    
    // Expresiones regulares para validación
    // Regex mejorada para correos electrónicos que acepta caracteres internacionales y TLDs más largos
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Objeto para seguimiento de validación
    const validationState = {
        nombre: false,
        email: false,
        password: false,
        confirmPassword: false,
        terminos: false
    };
    
    // Función para mostrar errores
    function showError(inputElement, message) {
        const errorElement = document.querySelector(`[data-error="${inputElement.name}"]`);
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        inputElement.classList.add('invalid');
    }
    
    // Función para ocultar errores
    function hideError(inputElement) {
        const errorElement = document.querySelector(`[data-error="${inputElement.name}"]`);
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        inputElement.classList.remove('invalid');
    }
    
    // Función para actualizar el estado del botón
    function updateSubmitButton() {
        const isFormValid = Object.values(validationState).every(value => value === true);
        submitBtn.disabled = !isFormValid;
    }
    
    // Validación del nombre
    function validateNombre() {
        if (!nombreInput.value.trim()) {
            showError(nombreInput, 'El nombre es obligatorio');
            validationState.nombre = false;
        } else {
            hideError(nombreInput);
            validationState.nombre = true;
        }
        updateSubmitButton();
    }
    
    // Validación del email
    function validateEmail() {
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, 'El correo electrónico es obligatorio');
            validationState.email = false;
        } else if (!EMAIL_REGEX.test(email)) {
            showError(emailInput, 'Ingrese un correo electrónico con formato válido');
            validationState.email = false;
        } else {
            hideError(emailInput);
            validationState.email = true;
        }
        updateSubmitButton();
    }
    
    // Validación de la contraseña
    function validatePassword() {
        const password = passwordInput.value;
        if (!password) {
            showError(passwordInput, 'La contraseña es obligatoria');
            validationState.password = false;
        } else if (!PASSWORD_REGEX.test(password)) {
            showError(passwordInput, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
            validationState.password = false;
        } else if (password.toLowerCase().includes(nombreInput.value.toLowerCase().split(' ')[0])) {
            // Verificar que la contraseña no contenga el nombre del usuario
            showError(passwordInput, 'La contraseña no debe contener tu nombre');
            validationState.password = false;
        } else if (password.toLowerCase().includes(emailInput.value.split('@')[0].toLowerCase())) {
            // Verificar que la contraseña no contenga el username del correo
            showError(passwordInput, 'La contraseña no debe contener tu nombre de usuario de correo');
            validationState.password = false;
        } else if (/(.)\1{2,}/.test(password)) {
            // Verificar que no tenga más de 2 caracteres repetidos consecutivos
            showError(passwordInput, 'La contraseña no debe contener más de 2 caracteres repetidos consecutivos');
            validationState.password = false;
        } else {
            hideError(passwordInput);
            validationState.password = true;
        }
        
        // Revalidar confirmación de contraseña si ya tiene contenido
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        updateSubmitButton();
    }
    
    // Validación de confirmación de contraseña
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!confirmPassword) {
            showError(confirmPasswordInput, 'Debe confirmar su contraseña');
            validationState.confirmPassword = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'Las contraseñas no coinciden');
            validationState.confirmPassword = false;
        } else {
            hideError(confirmPasswordInput);
            validationState.confirmPassword = true;
        }
        updateSubmitButton();
    }
    
    // Validación de términos y condiciones
    function validateTerminos() {
        if (!terminosCheckbox.checked) {
            showError(terminosCheckbox, 'Debe aceptar los términos y condiciones');
            validationState.terminos = false;
        } else {
            hideError(terminosCheckbox);
            validationState.terminos = true;
        }
        updateSubmitButton();
    }
    
    // Agregar event listeners para validación en tiempo real
    nombreInput.addEventListener('blur', validateNombre);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    terminosCheckbox.addEventListener('change', validateTerminos);
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        validateNombre();
        validateEmail();
        validatePassword();
        validateConfirmPassword();
        validateTerminos();
        
        // Verificar si el formulario es válido
        const isFormValid = Object.values(validationState).every(value => value === true);
        
        if (isFormValid) {
            // Recopilar datos del formulario
            const userData = {
                nombre: nombreInput.value,
                email: emailInput.value,
                fechaNacimiento: fechaNacimientoInput.value
            };
            
            // Guardar datos en localStorage para recuperarlos en la página de confirmación
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redireccionar a la página de confirmación
            window.location.href = 'confirmacion.html';
        }
    });
    
    // Inicializar el estado del botón
    updateSubmitButton();
});