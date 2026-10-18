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
