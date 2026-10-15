'use strict';

(() => {
    const form = document.querySelector('#register-form');
    if (!form) return;
    const name = document.querySelector('#register-name');
    const email = document.querySelector('#register-email');
    const password = document.querySelector('#register-password');
    const confirmation = document.querySelector('#register-confirm');
    const status = document.querySelector('#register-status');
    const success = document.querySelector('#register-success');
    const errorSummary = document.querySelector('#register-error');
    const rules = [
        { label: '8–128 characters', test: value => /^.{8,128}$/u.test(value) },
        { label: 'An uppercase letter (A–Z)', test: value => /[A-Z]/.test(value) },
        { label: 'A lowercase letter (a–z)', test: value => /[a-z]/.test(value) },
        { label: 'A digit (0–9)', test: value => /[0-9]/.test(value) },
        { label: 'A special character', test: value => /[^A-Za-z0-9\s]/.test(value) }
    ];
    // A meaningful selection rule, created with DOM under the HTML freeze.
    const group = document.createElement('div');
    group.classList.add('mb-3');
    const label = document.createElement('label');
    label.classList.add('form-label');
    label.htmlFor = 'register-interest';
    label.textContent = 'Primary shopping interest';
    const interest = document.createElement('select');
    interest.id = 'register-interest';
    interest.classList.add('form-select');
    for (const [value, text] of [['', 'Choose an interest'], ['tableware', 'Tableware'], ['serving', 'Serving'], ['accessories', 'Accessories']]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        interest.append(option);
    }
    group.append(label, interest);
    form.querySelector('.d-flex').before(group);
    const fields = [name, email, password, confirmation, interest];
    const checklist = document.createElement('ul');
    checklist.classList.add('small', 'mt-2');
    document.querySelector('#register-password-help').after(checklist);
    const ruleNodes = rules.map(rule => {
        const node = document.createElement('li');
        checklist.append(node);
        return node;
    });
    const errors = new Map();
    fields.forEach(input => {
        const node = document.createElement('p');
        node.id = input.id + '-validation';
        node.classList.add('state-error', 'state-hidden', 'small', 'mt-2');
        const anchor = input.closest('.password-field') || input;
        anchor.after(node);
        input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), node.id].filter(Boolean).join(' '));
        errors.set(input, node);
    });
    form.noValidate = true;
    document.querySelector('#register-submit').disabled = false;
    document.querySelector('#register-submit').textContent = 'Check registration';
    document.querySelector('#register-confirm-help').textContent = 'Repeat your sample password exactly.';
    let submitted = false;

    function validateField(input) {
        if (input === name) return name.value.trim().length >= 2 && name.value.trim().length <= 100 ? '' : 'Enter a name of 2–100 characters.';
        if (input === email) return isValidEmail(email.value) && email.value.trim().length <= 254 ? '' : 'Enter a valid email address.';
        if (input === password) return rules.every(rule => rule.test(password.value)) ? '' : 'Meet all five password requirements.';
        if (input === confirmation) return confirmation.value !== '' && confirmation.value === password.value ? '' : 'Passwords must match exactly.';
        return ['tableware', 'serving', 'accessories'].includes(interest.value) ? '' : 'Choose your primary shopping interest.';
    }

    function showValidation(input) {
        const message = validateField(input);
        errors.get(input).textContent = message;
        errors.get(input).classList.toggle('state-hidden', message === '');
        input.classList.toggle('is-invalid', message !== '');
        input.classList.toggle('is-valid', message === '');
        input.setAttribute('aria-invalid', String(message !== ''));
        return message === '';
    }

    function updateChecklist() {
        rules.forEach((rule, index) => {
            const met = rule.test(password.value);
            ruleNodes[index].textContent = (met ? 'Met: ' : 'Needed: ') + rule.label;
            ruleNodes[index].classList.toggle('fw-bold', met);
        });
    }

    function togglePassword(input, button, description) {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        button.setAttribute('aria-pressed', String(show));
        button.querySelector('.visually-hidden').textContent = (show ? 'Hide ' : 'Show ') + description;
    }

    const toggles = [[password, document.querySelector('#toggle-password'), 'password'],
        [confirmation, document.querySelector('#toggle-confirmation'), 'password confirmation']];
    toggles.forEach(([input, button, description]) => {
        button.setAttribute('aria-controls', input.id);
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => togglePassword(input, button, description));
    });

    function handleEdit() {
        success.classList.add('state-hidden');
        status.textContent = 'Editing sample details. No account has been created.';
        updateChecklist();
        if (submitted) {
            fields.forEach(showValidation);
            errorSummary.classList.toggle('state-hidden', fields.every(input => validateField(input) === ''));
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        submitted = true;
        success.classList.add('state-hidden');
        const invalid = fields.filter(input => !showValidation(input));
        errorSummary.classList.toggle('state-hidden', invalid.length === 0);
        if (invalid.length > 0) {
            status.textContent = 'Correct the indicated fields.';
            invalid[0].focus();
            return;
        }
        success.textContent = 'Front-end demonstration complete for ' + name.value.trim() +
            ' (' + email.value.trim() + '). Interest: ' + interest.options[interest.selectedIndex].textContent +
            '. No data was sent to a server and no account was created.';
        success.classList.remove('state-hidden');
        status.textContent = 'Validation passed. Password fields have been cleared.';
        // Do not store passwords in browser storage, arrays, URLs or summaries.
        password.value = '';
        confirmation.value = '';
        password.type = 'password';
        confirmation.type = 'password';
        submitted = false;
        fields.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            input.removeAttribute('aria-invalid');
        });
        toggles.forEach(([, button, description]) => {
            button.setAttribute('aria-pressed', 'false');
            button.querySelector('.visually-hidden').textContent = 'Show ' + description;
        });
        updateChecklist();
    }

    function handleReset(event) {
        event.preventDefault();
        fields.forEach(input => {
            input.value = '';
            input.classList.remove('is-valid', 'is-invalid');
            input.removeAttribute('aria-invalid');
            errors.get(input).classList.add('state-hidden');
        });
        toggles.forEach(([input, button, description]) => {
            input.type = 'password';
            button.setAttribute('aria-pressed', 'false');
            button.querySelector('.visually-hidden').textContent = 'Show ' + description;
        });
        submitted = false;
        success.classList.add('state-hidden');
        errorSummary.classList.add('state-hidden');
        status.textContent = 'Form cleared. No account has been created.';
        updateChecklist();
    }

    form.addEventListener('input', handleEdit);
    form.addEventListener('change', handleEdit);
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('reset', handleReset);
    updateChecklist();
})();

