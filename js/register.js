const form = document.querySelector('#register-form');
const nameInput = document.querySelector('#register-name');
const password = document.querySelector('#register-password');
const confirmation = document.querySelector('#register-confirm');
const statusMessage = document.querySelector('#register-status');
const success = document.querySelector('#register-success');
const passwordButtons = document.querySelectorAll('.password-toggle');

function checkFields() {
    if (nameInput.value.trim() === '') {
        nameInput.setCustomValidity('Enter your name.');
    } else {
        nameInput.setCustomValidity('');
    }

    if (confirmation.value !== password.value) {
        confirmation.setCustomValidity('Passwords must match.');
    } else {
        confirmation.setCustomValidity('');
    }

    success.classList.add('state-hidden');
    statusMessage.textContent = 'No account has been created.';
}

function togglePassword(event) {
    const button = event.currentTarget;
    const input = button.closest('.password-field').querySelector('input');

    if (input.type === 'password') {
        input.type = 'text';
        button.querySelector('span').textContent = 'Hide password';
    } else {
        input.type = 'password';
        button.querySelector('span').textContent = 'Show password';
    }
}

function hidePasswords() {
    password.type = 'password';
    confirmation.type = 'password';
    for (const button of passwordButtons) {
        button.querySelector('span').textContent = 'Show password';
    }
}

function submitForm(event) {
    event.preventDefault();
    success.textContent = 'Form checked successfully. No account has been created.';
    success.classList.remove('state-hidden');
    statusMessage.textContent = 'All fields are valid.';
    password.value = '';
    confirmation.value = '';
    hidePasswords();
}

function clearForm() {
    nameInput.setCustomValidity('');
    confirmation.setCustomValidity('');
    success.classList.add('state-hidden');
    statusMessage.textContent = 'Form cleared. No account has been created.';
    hidePasswords();
}

for (const button of passwordButtons) {
    button.addEventListener('click', togglePassword);
}

form.addEventListener('input', checkFields);
form.addEventListener('submit', submitForm);
form.addEventListener('reset', clearForm);
checkFields();

