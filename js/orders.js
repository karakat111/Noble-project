'use strict';

// Orders uses native DOM APIs and delegated events.
document.addEventListener('DOMContentLoaded', function () {
    const { findProduct, money, totals } = StudentShop;
    const storageKey = 'noble-demo-shop-v1';
    const list = document.querySelector('#orders-list');
    const empty = document.querySelector('#orders-empty');
    const message = document.querySelector('#orders-message');
    const help = document.querySelector('#orders-help');
    const refreshButton = document.createElement('button');
    refreshButton.id = 'orders-refresh';
    refreshButton.type = 'button';
    refreshButton.className = 'btn btn-outline-secondary';
    refreshButton.textContent = '↻ Refresh history';
    document.querySelector('#orders-actions').append(refreshButton);
    message.setAttribute('role', 'status');
    if (help) help.textContent = 'Your completed orders are saved on this device.';
    empty.querySelector('p').textContent = 'Find something you love in the catalogue. Your completed orders will appear here.';
    const recovery = createElement('div', 'mb-3');
    const download = createElement('button', 'btn btn-outline-secondary me-2', 'Download saved data');
    const reset = createElement('button', 'btn btn-outline-secondary', 'Reset damaged history');
    recovery.append(download, reset);
    recovery.hidden = true;
    message.after(recovery);
    let damagedRaw = null;

    download.addEventListener('click', function () {
        if (damagedRaw === null) return;
        const url = URL.createObjectURL(new Blob([damagedRaw], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'noble-history-backup.json';
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    reset.addEventListener('click', function () {
        if (damagedRaw === null || !window.confirm('Reset all saved order history? A local backup will be kept. Download a copy first if needed.')) return;
        try {
            if (localStorage.getItem(storageKey) !== damagedRaw) {
                refreshOrders();
                message.textContent = 'Saved data changed. Review the refreshed history before resetting.';
                return;
            }
            let state;
            try { state = JSON.parse(damagedRaw); } catch { state = null; }
            if (!state || typeof state !== 'object' || Array.isArray(state)) state = {};
            state.orders = [];
            localStorage.setItem(storageKey + '-backup-' + Date.now(), damagedRaw);
            localStorage.setItem(storageKey, JSON.stringify(state));
            refreshOrders();
            message.textContent = 'History reset. A copy of the previous data remains in browser storage.';
            refreshButton.focus();
        } catch {
            message.textContent = 'Reset could not be completed. Your history was not cleared. Download a copy and check browser storage.';
        }
    });

    function validateOrder(order) {
        if (!order || typeof order.reference !== 'string' ||
            !/^(?:DEMO|ORDER)-[A-Z0-9-]{1,80}$/.test(order.reference) ||
            typeof order.date !== 'string' || !Number.isFinite(Date.parse(order.date)) ||
            !Array.isArray(order.items) || order.items.length === 0 || order.items.length > 10) return null;
        const items = [];
        const ids = new Set();
        let totalQuantity = 0;
        let orderTotal = 0;
        order.items.forEach(function (item) {
            const product = item && findProduct(item.id);
            const savedName = item && typeof item.name === 'string' && item.name.trim();
            const name = savedName || (product && product.name);
            const unitPrice = item && (item.unitPrice ?? item.price ?? (product && product.price));
            const valid = item && typeof item.id === 'string' && name && !ids.has(item.id) && Number.isInteger(item.quantity) &&
                item.quantity >= 1 && item.quantity <= 99 && Number.isSafeInteger(unitPrice) && unitPrice >= 0 &&
                (!('price' in item) || (Number.isSafeInteger(item.price) && item.price >= 0)) &&
                (!('unitPrice' in item) || (Number.isSafeInteger(item.unitPrice) && item.unitPrice >= 0));
            if (!valid) return;
            const subtotal = unitPrice * item.quantity;
            const nextQuantity = totalQuantity + item.quantity;
            const nextTotal = orderTotal + subtotal;
            if (!Number.isSafeInteger(subtotal) || !Number.isSafeInteger(nextQuantity) || !Number.isSafeInteger(nextTotal)) return;
            ids.add(item.id);
            items.push({ name: name, quantity: item.quantity, unitPrice: unitPrice });
            totalQuantity = nextQuantity;
            orderTotal = nextTotal;
        });
        if (items.length !== order.items.length) return null;
        return { reference: order.reference, date: order.date, items: items, totalQuantity: totalQuantity, total: orderTotal };
    }

    function readOrders() {
        damagedRaw = null;
        let raw;
        try {
            raw = window.localStorage.getItem(storageKey);
        } catch {
            return { orders: [], error: 'Browser storage is unavailable. Allow local storage and try Refresh.' };
        }
        if (raw === null) return { orders: [], error: '' };
        try {
            const state = JSON.parse(raw);
            if (!state || !Array.isArray(state.orders)) throw new Error('Invalid history');
            const orders = [];
            const references = new Set();
            let rejected = 0;
            state.orders.forEach(function (record) {
                const order = validateOrder(record);
                if (!order || references.has(order.reference)) {
                    rejected += 1;
                    return;
                }
                references.add(order.reference);
                orders.push(order);
            });
            if (rejected) damagedRaw = raw;
            return {
                orders: orders,
                error: rejected ? `${rejected} invalid or duplicate order record(s) were not displayed. Saved data was not changed.` : ''
            };
        } catch {
            damagedRaw = raw;
            return { orders: [], error: 'Saved history is malformed. Download a copy or use Reset damaged history to start again.' };
        }
    }

    function createElement(tag, classes, text = '') {
        const element = document.createElement(tag);
        element.className = classes;
        element.textContent = text;
        return element;
    }

    function buildOrderCard(order) {
        const summary = totals(order.items);
        const card = createElement('article', 'order-card border rounded p-4 mb-4');
        const heading = createElement('div', 'd-flex flex-wrap justify-content-between gap-2 mb-3');
        const details = createElement('div', 'order-details');
        const items = createElement('ul', 'order-items ps-4');
        heading.append(
            createElement('h2', 'h4 order-number mb-0', order.reference.replace(/^DEMO-/, 'ORDER-')),
            createElement('span', 'badge text-bg-secondary', 'Order details')
        );
        for (const item of order.items) {
            items.append(createElement('li', '',
                `${item.name}: ${item.quantity} × ${money(item.unitPrice)} = ${money(item.unitPrice * item.quantity)}`));
        }
        const time = createElement('time', 'order-date', new Date(order.date).toLocaleString());
        time.dateTime = new Date(order.date).toISOString();
        const date = createElement('p', 'small');
        date.append('Placed: ', time);
        details.append(
            date, items,
            createElement('p', 'mt-3', `Total quantity: ${summary.quantity}`),
            createElement('p', 'fw-semibold mt-3', `Total: ${money(summary.price)}`),
            createElement('p', 'small mb-0', 'Order details are saved on this device.'),
            createElement('p', 'small mt-2 mb-0', 'Totals use saved unit prices when available. Older records use catalogue prices.')
        );
        const toggle = createElement('button', 'order-toggle btn btn-outline-secondary btn-sm mb-3', 'Hide order details');
        toggle.type = 'button';
        toggle.setAttribute('aria-expanded', 'true');
        heading.append(toggle);
        card.append(heading, details);
        return card;
    }

    function renderOrders(result) {
        recovery.hidden = damagedRaw === null;
        list.replaceChildren();
        for (const order of result.orders) {
            list.append(buildOrderCard(order));
        }
        empty.hidden = result.orders.length !== 0 || Boolean(result.error);
        message.classList.toggle('state-error', Boolean(result.error));
        message.textContent = result.error ||
            (result.orders.length ? `${result.orders.length} saved order(s) · Stored on this device.` :
                'Your order history will appear here.');
    }

    function refreshOrders() {
        renderOrders(readOrders());
    }

    refreshButton.addEventListener('click', refreshOrders);

    // One listener handles all current and future details buttons.
    list.addEventListener('click', function (event) {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest('.order-toggle');
        if (!button || !list.contains(button)) return;
        const details = button.closest('.order-card').querySelector('.order-details');
        const expanded = button.getAttribute('aria-expanded') === 'true';
        details.hidden = expanded;
        button.setAttribute('aria-expanded', String(!expanded));
        button.textContent = expanded ? 'Show order details' : 'Hide order details';
    });

    window.addEventListener('storage', function (event) {
        if (event.key !== storageKey && event.key !== null) return;
        try {
            if (event.storageArea === window.localStorage) refreshOrders();
        } catch {
            refreshOrders();
        }
    });

    refreshOrders();
});
