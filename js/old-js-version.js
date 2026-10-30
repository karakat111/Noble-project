// Original plain-JavaScript versions captured before the jQuery rewrite.
// Comparison only: do not connect this file to any HTML page.
// Functions isolate repeated variable names; none are called.

function cartPlainJavaScriptVersion() {
    const select = document.querySelector('#cart-product');
    const addButton = document.querySelector('#add-to-cart');
    const template = document.querySelector('#cart-item-template');
    const items = document.querySelector('#cart-items');
    const total = document.querySelector('#cart-total');
    const count = document.querySelector('#cart-item-count');
    const empty = document.querySelector('#cart-empty');
    const error = document.querySelector('#checkout-error');
    const message = document.querySelector('#cart-message');
    const orderButton = document.querySelector('#place-order');
    
    function addProduct() {
        const product = select.options[select.selectedIndex];
        const row = template.content.firstElementChild.cloneNode(true);
        row.querySelector('.cart-name').textContent = product.textContent;
        row.querySelector('.cart-price').textContent = product.dataset.price;
        row.querySelector('.cart-quantity').addEventListener('input', updateTotal);
        row.querySelector('.cart-remove').addEventListener('click', removeItem);
        items.append(row);
        updateTotal();
        message.textContent = product.textContent + ' added to the cart.';
    }
    
    function updateTotal() {
        const rows = items.querySelectorAll('.cart-item');
        let sum = 0;
        let quantityTotal = 0;
        let valid = true;
    
        for (const row of rows) {
            const input = row.querySelector('.cart-quantity');
            const quantity = Number(input.value);
            const price = Number(row.querySelector('.cart-price').textContent);
    
            if (!Number.isInteger(quantity) || quantity < 1) {
                valid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
                sum += price * quantity;
                quantityTotal += quantity;
            }
        }
    
        if (valid) {
            total.textContent = sum.toLocaleString('en-US') + ' ₸';
            count.textContent = quantityTotal;
        } else {
            total.textContent = '—';
            count.textContent = '—';
        }
    
        error.classList.toggle('state-hidden', valid);
        empty.classList.toggle('state-hidden', rows.length > 0);
        orderButton.disabled = rows.length === 0 || !valid;
        message.textContent = '';
    }
    
    function removeItem(event) {
        const row = event.currentTarget.closest('.cart-item');
        row.remove();
        updateTotal();
        message.textContent = 'Item removed.';
    }
    
    function placeOrder() {
        updateTotal();
        if (orderButton.disabled) return;
        message.textContent = 'Demo complete! Total: ' + total.textContent +
            '. No real order was sent and no payment was collected.';
    }
    
    addButton.addEventListener('click', addProduct);
    orderButton.addEventListener('click', placeOrder);
    updateTotal();
    
    
    
}

function carePlainJavaScriptVersion() {
    const form = document.querySelector('#care-checklist-form');
    const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
    const progress = document.querySelector('#care-progress');
    const success = document.querySelector('#care-success');
    
    
    function calculateProgress(inputs) {
        const completed = inputs.filter(input => input.checked).length;
        return { completed: completed, total: inputs.length, percent: Math.round(completed / inputs.length * 100) };
    }
    
    function updateProgress() {
        const result = calculateProgress(checks);
        progress.textContent = result.completed + ' of ' + result.total + ' checks completed (' + result.percent + '%).';
        success.classList.toggle('state-hidden', result.completed !== result.total);
        checks.forEach(input => input.closest('.form-check').classList.toggle('state-selected', input.checked));
    }
    
    function resetChecklist(event) {
        event.preventDefault();
        checks.forEach(input => { input.checked = false; });
        updateProgress();
        progress.textContent += ' Checklist cleared.';
    }
    
    form.addEventListener('change', updateProgress);
    form.addEventListener('reset', resetChecklist);
    form.addEventListener('submit', event => event.preventDefault());
    updateProgress();
    
    
}

function registerPlainJavaScriptVersion() {
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
    
    
}

