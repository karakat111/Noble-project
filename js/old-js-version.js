"use strict";

const filterForm = document.querySelector("#catalog-filters");
const filterButtons = [...filterForm.querySelectorAll("[data-filter]")];
const products = [...filterForm.querySelectorAll(".product-item")];
const filterStatus = document.querySelector("#filter-help");
const emptyMessage = document.querySelector("#filter-empty");
const selected = { category: "all", price: "any" };

function applyFilters() {
    let visibleCount = 0;

    products.forEach((product) => {
        const price = Number(product.dataset.price);
        const matchesCategory = selected.category === "all" ||
            product.dataset.category === selected.category;
        const matchesPrice = selected.price === "any" ||
            (selected.price === "under" && price <= 100000) ||
            (selected.price === "over" && price > 100000);

        // Both filters must match. Hide the whole column so the grid has no gaps.
        const visible = matchesCategory && matchesPrice;
        product.hidden = !visible;
        product.classList.toggle("d-none", !visible);
        if (visible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed",
            String(selected[button.dataset.filter] === button.value));
    });
    emptyMessage.hidden = visibleCount !== 0;
    filterStatus.textContent = `Showing ${visibleCount} of ${products.length} products.`;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Changing one group preserves the other group's selection.
        selected[button.dataset.filter] = button.value;
        applyFilters();
    });
});

filterForm.addEventListener("reset", () => {
    selected.category = "all";
    selected.price = "any";
    applyFilters();
});

// Filtering stays on this page without submitting the form or reloading.
filterForm.addEventListener("submit", (event) => event.preventDefault());
applyFilters();


/* Original Home implementation: js/home.js. Includes discovery and shared setup needed by the enquiry form. Comparison archive only; do not link. */
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


/* Original Orders implementation: js/orders.js. Comparison archive only; do not link. */
'use strict';

(() => {
    const { findProduct, money, element, totals } = StudentShop;
    // Matches js/shop.js. This reader never writes history or changes the cart.
    const storageKey = 'noble-demo-shop-v1';
    const list = document.querySelector('#orders-list');
    const empty = document.querySelector('#orders-empty');
    const message = document.querySelector('#orders-message');
    const template = document.querySelector('#order-template');
    const refresh = element('button', 'Refresh order history', 'btn btn-outline-secondary mb-3');
    refresh.type = 'button';
    refresh.id = 'orders-refresh';
    list.before(refresh);
    message.setAttribute('role', 'status');
    document.querySelector('#orders-help').textContent =
        'Demonstration history saved on this browser. The current Cart page does not save completed orders yet. No real payment or purchase occurs.';
    empty.querySelector('p').textContent =
        'No demonstration orders are saved. Explore the products; saving completed orders from Cart still requires team integration.';

    function validateOrder(order) {
        if (!order || typeof order.reference !== 'string' ||
            !/^DEMO-[A-Z0-9-]{1,80}$/.test(order.reference) ||
            typeof order.date !== 'string' || !Number.isFinite(Date.parse(order.date)) ||
            !Array.isArray(order.items) || order.items.length === 0 || order.items.length > 10) return null;
        const items = [];
        const ids = new Set();
        for (const item of order.items) {
            const product = item && findProduct(item.id);
            if (!product || ids.has(item.id) || !Number.isInteger(item.quantity) ||
                item.quantity < 1 || item.quantity > 99 || !Number.isSafeInteger(product.price) || product.price < 0)
                return null;
            // v1 stores IDs, not price snapshots. Reject unexpected invalid price fields too.
            if (('price' in item && (!Number.isSafeInteger(item.price) || item.price < 0)) ||
                ('unitPrice' in item && (!Number.isSafeInteger(item.unitPrice) || item.unitPrice < 0))) return null;
            ids.add(item.id);
            items.push({ name: product.name, quantity: item.quantity, unitPrice: product.price });
        }
        return { reference: order.reference, date: order.date, items };
    }

    function readOrders() {
        let raw;
        try { raw = localStorage.getItem(storageKey); }
        catch { return { orders: [], error: 'Browser storage is unavailable. Allow local storage and try Refresh.' }; }
        if (raw === null) return { orders: [], error: '' };
        try {
            const state = JSON.parse(raw);
            if (!state || !Array.isArray(state.orders)) throw new Error('Invalid history');
            const orders = [];
            const references = new Set();
            let rejected = 0;
            for (const record of state.orders) {
                const order = validateOrder(record);
                if (!order || references.has(order.reference)) { rejected += 1; continue; }
                references.add(order.reference);
                orders.push(order);
            }
            return { orders, error: rejected ? `${rejected} invalid or duplicate order record(s) were not displayed. Saved data was not changed.` : '' };
        } catch {
            return { orders: [], error: 'Saved history is malformed. It has not been changed. Ask the team to repair the data, then refresh.' };
        }
    }

    function renderOrder(order) {
        const card = template.content.firstElementChild.cloneNode(true);
        card.querySelector('.order-number').textContent = order.reference;
        card.querySelector('.badge').textContent = 'Demonstration only';
        const time = card.querySelector('.order-date');
        time.dateTime = new Date(order.date).toISOString();
        time.textContent = new Date(order.date).toLocaleString();
        for (const item of order.items) {
            card.querySelector('.order-items').append(element('li',
                `${item.name}: ${item.quantity} × ${money(item.unitPrice)} = ${money(item.unitPrice * item.quantity)}`));
        }
        const summary = totals(order.items);
        card.querySelector('.order-total').textContent = money(summary.price);
        card.querySelector('.order-items').after(element('p', `Total quantity: ${summary.quantity}`, 'mt-3'));
        card.append(element('p', 'Totals use current recorded catalogue prices; the v1 history does not store price snapshots.', 'small mt-2 mb-0'));
        return card;
    }

    function refreshOrders() {
        const result = readOrders();
        for (const child of [...list.children]) child.remove();
        for (const order of result.orders) list.append(renderOrder(order));
        empty.hidden = result.orders.length !== 0 || Boolean(result.error);
        message.classList.toggle('state-error', Boolean(result.error));
        message.textContent = result.error || `${result.orders.length} demonstration order(s) loaded. No payment was collected.`;
    }

    refresh.addEventListener('click', refreshOrders);
    window.addEventListener('storage', event => {
        if (event.key === storageKey || event.key === null) refreshOrders();
    });
    refreshOrders();
})();
