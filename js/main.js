'use strict';


function isValidRequiredText(value) {
  return value.trim() !== '';
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

function generateReference() {
  return 'NB-' + Math.floor(Math.random() * 90000 + 10000);
}

function showFieldError(input, message) {
  input.classList.add('state-error');
  const errorEl = document.createElement('div');
  errorEl.classList.add('state-error');
  errorEl.setAttribute('data-error-for', input.id);
  errorEl.textContent = message;
  input.insertAdjacentElement('afterend', errorEl);
}

function clearFieldErrors(form) {
  const marked = form.querySelectorAll('.state-error');
  marked.forEach(function (el) {
    if (el.hasAttribute('data-error-for')) {
      el.remove();
    } else {
      el.classList.remove('state-error');
    }
  });
}
