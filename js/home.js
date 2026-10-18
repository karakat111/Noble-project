'use strict';

(() => {
    if (document.querySelector('#product-discovery')) return;
    const { products, findProduct, money, element, randomProduct } = StudentShop;
    const main = document.querySelector('main');
    const discovery = element('section', '', 'mt-5 border-top pt-4');
    discovery.id = 'product-discovery';
    const result = element('div', '', 'mb-3');
    result.setAttribute('aria-live', 'polite');
    const discover = element('button', 'Discover another piece', 'btn btn-outline-secondary');
    discover.type = 'button';
    let previousId = '';

    function showProduct() {
        const product = randomProduct(previousId);
        previousId = product.id;
        for (const child of [...result.children]) child.remove();
        const link = element('a', 'Explore this product', 'btn btn-outline-secondary');
        link.href = 'page-1.html?product=' + encodeURIComponent(product.id) + '#catalog-results';
        result.append(element('h3', product.name, 'h4'),
            element('p', `${product.category} · ${money(product.price)}`), link);
    }

    discovery.append(element('h2', 'Discover a piece'), result, discover);
    discover.addEventListener('click', showProduct);
    main.append(discovery);
    showProduct();

    const section = element('section', '', 'mt-5 border-top pt-4');
    section.id = 'product-enquiry';
    section.append(element('h2', 'Demonstration product enquiry'),
        element('p', 'Practice planning an enquiry. Nothing is sent or saved, and no purchase or payment takes place.'));
    const form = element('form', '', 'row g-3');
    form.id = 'enquiry-form';
    form.noValidate = true;
    const fields = {};
    const definitions = [
        ['name', 'Your name', 'text'], ['email', 'Email', 'email'],
        ['product', 'Product', 'select'], ['quantity', 'Quantity (1–99)', 'number'],
        ['budget', 'Total budget (₸)', 'number']
    ];
    for (const [key, title, type] of definitions) {
        const wrapper = element('div', '', 'col-12 col-md-6');
        const label = element('label', title, 'form-label');
        const input = element(type === 'select' ? 'select' : 'input', '',
            type === 'select' ? 'form-select' : 'form-control');
        input.id = 'enquiry-' + key;
        input.name = key;
        input.required = true;
        label.htmlFor = input.id;
        if (type !== 'select') input.type = type;
        if (key === 'name' || key === 'email') {
            input.autocomplete = key;
            input.maxLength = key === 'name' ? 100 : 254;
        }
        if (key === 'quantity') { input.min = '1'; input.max = '99'; input.step = '1'; }
        if (key === 'budget') { input.min = '1'; input.step = '1'; }
        const error = element('p', '', 'invalid-feedback');
        error.id = input.id + '-error';
        input.setAttribute('aria-describedby', error.id);
        wrapper.append(label, input, error);
        form.append(wrapper);
        fields[key] = { input, error };
    }
    const placeholder = element('option', 'Choose a product');
    placeholder.value = '';
    fields.product.input.append(placeholder);
    for (const product of products) {
        const option = element('option', `${product.name} — ${money(product.price)}`);
        option.value = product.id;
        fields.product.input.append(option);
    }
    const requested = new URLSearchParams(location.search).get('product');
    if (findProduct(requested)) fields.product.input.value = requested;
    const actions = element('div', '', 'col-12 d-flex flex-wrap gap-2');
    const submit = element('button', 'Check demonstration enquiry', 'btn btn-secondary');
    submit.type = 'submit';
    const reset = element('button', 'Clear enquiry', 'btn btn-outline-secondary');
    reset.type = 'reset';
    actions.append(submit, reset);
    const status = element('p', '', 'col-12 text-break');
    status.id = 'enquiry-status';
    status.setAttribute('role', 'status');
    form.append(actions, status);
    section.append(form);
    main.append(section);

    function validate(values) {
        const errors = {};
        const product = findProduct(values.product);
        const quantity = Number(values.quantity);
        const budget = Number(values.budget);
        if (values.name.trim().length < 2 || values.name.trim().length > 100)
            errors.name = 'Enter a name between 2 and 100 characters.';
        if (!values.email.trim() || !fields.email.input.validity.valid)
            errors.email = 'Enter a valid email address.';
        if (!product) errors.product = 'Choose a product from the catalogue.';
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
            errors.quantity = 'Enter a whole quantity from 1 to 99.';
        if (!Number.isSafeInteger(budget) || budget <= 0)
            errors.budget = 'Enter a positive whole budget in tenge.';
        else if (product && !errors.quantity && budget < product.price * quantity)
            errors.budget = `Budget must cover ${money(product.price * quantity)} for this quantity.`;
        return errors;
    }

    function clearFeedback() {
        for (const field of Object.values(fields)) {
            field.error.textContent = '';
            field.input.classList.remove('is-invalid');
            field.input.removeAttribute('aria-invalid');
        }
        status.textContent = '';
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        clearFeedback();
        const values = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.input.value]));
        const errors = validate(values);
        for (const [key, message] of Object.entries(errors)) {
            fields[key].error.textContent = message;
            fields[key].input.classList.add('is-invalid');
            fields[key].input.setAttribute('aria-invalid', 'true');
        }
        const first = Object.keys(errors)[0];
        if (first) {
            status.textContent = 'Please correct the marked fields.';
            fields[first].input.focus();
            return;
        }
        const product = findProduct(values.product);
        status.textContent = `Demo enquiry checked for ${values.name.trim()}: ${values.quantity} × ${product.name}, ` +
            `estimated total ${money(product.price * Number(values.quantity))}. Nothing was sent or saved; no purchase or payment occurred.`;
    });
    form.addEventListener('input', clearFeedback);
    form.addEventListener('change', clearFeedback);
    form.addEventListener('reset', clearFeedback);
})();
