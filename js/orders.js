'use strict';

// jQuery 3.7.1 replaces native querying, cloning, class changes and event listeners from the old Orders feature.
$(document).ready(function () {
    const { findProduct, money, totals } = StudentShop;
    const storageKey = 'noble-demo-shop-v1';
    const $list = $('#orders-list');
    const $empty = $('#orders-empty');
    const $message = $('#orders-message');
    const $refresh = $('<button>', {
        id: 'orders-refresh',
        type: 'button',
        'class': 'btn btn-outline-secondary mb-3',
        text: 'Refresh order history'
    });

    $refresh.insertBefore($list);
    $message.attr('role', 'status');
    $('#orders-help').text('Demonstration history saved on this browser. The current Cart page does not save completed orders yet. No real payment or purchase occurs.');
    $empty.find('p:first').text('No demonstration orders are saved. Explore the products; saving completed orders from Cart still requires team integration.');

    function validateOrder(order) {
        if (!order || typeof order.reference !== 'string' ||
            !/^DEMO-[A-Z0-9-]{1,80}$/.test(order.reference) ||
            typeof order.date !== 'string' || !Number.isFinite(Date.parse(order.date)) ||
            !Array.isArray(order.items) || order.items.length === 0 || order.items.length > 10) return null;
        const items = [];
        const ids = new Set();
        order.items.forEach(function (item) {
            const product = item && findProduct(item.id);
            const valid = product && !ids.has(item.id) && Number.isInteger(item.quantity) &&
                item.quantity >= 1 && item.quantity <= 99 && Number.isSafeInteger(product.price) && product.price >= 0 &&
                (!('price' in item) || (Number.isSafeInteger(item.price) && item.price >= 0)) &&
                (!('unitPrice' in item) || (Number.isSafeInteger(item.unitPrice) && item.unitPrice >= 0));
            if (!valid) return;
            ids.add(item.id);
            items.push({ name: product.name, quantity: item.quantity, unitPrice: product.price });
        });
        if (items.length !== order.items.length) return null;
        return { reference: order.reference, date: order.date, items: items };
    }

    function readOrders() {
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
            return {
                orders: orders,
                error: rejected ? `${rejected} invalid or duplicate order record(s) were not displayed. Saved data was not changed.` : ''
            };
        } catch {
            return { orders: [], error: 'Saved history is malformed. It has not been changed. Ask the team to repair the data, then refresh.' };
        }
    }

    function buildOrderCard(order) {
        const summary = totals(order.items);
        const $card = $('<article>', { 'class': 'order-card border rounded p-4 mb-4' });
        const $heading = $('<div>', { 'class': 'd-flex flex-wrap justify-content-between gap-2 mb-3' });
        const $details = $('<div>', { 'class': 'order-details' });
        const $items = $('<ul>', { 'class': 'order-items ps-4' });

        $heading.append(
            $('<h2>', { 'class': 'h4 order-number mb-0' }).text(order.reference),
            $('<span>', { 'class': 'badge text-bg-secondary' }).text('Demonstration only')
        );
        order.items.forEach(function (item) {
            $('<li>').text(`${item.name}: ${item.quantity} × ${money(item.unitPrice)} = ${money(item.unitPrice * item.quantity)}`)
                .appendTo($items);
        });
        const $time = $('<time>', { 'class': 'order-date' })
            .attr('datetime', new Date(order.date).toISOString())
            .text(new Date(order.date).toLocaleString());
        $details.append(
            $('<p>', { 'class': 'small' }).append('Placed: ', $time),
            $items,
            $('<p>', { 'class': 'mt-3' }).text(`Total quantity: ${summary.quantity}`),
            $('<p>', { 'class': 'fw-semibold mt-3' }).text(`Total: ${money(summary.price)}`),
            $('<p>', { 'class': 'small mb-0' }).text('This demonstration order is recorded on this device only. No payment was collected and no request was sent to the store.'),
            $('<p>', { 'class': 'small mt-2 mb-0' }).text('Totals use current recorded catalogue prices; the v1 history does not store price snapshots.')
        );
        $card.append(
            $heading,
            $('<button>', {
                type: 'button',
                'class': 'order-toggle btn btn-outline-secondary btn-sm mb-3',
                'aria-expanded': 'true',
                text: 'Hide order details'
            }),
            $details
        );
        return $card;
    }

    function renderOrders(result) {
        $list.empty();
        result.orders.forEach(function (order) {
            buildOrderCard(order).appendTo($list);
        });
        $empty.prop('hidden', result.orders.length !== 0 || Boolean(result.error));
        $message.toggleClass('state-error', Boolean(result.error))
            .text(result.error || `${result.orders.length} demonstration order(s) loaded. No payment was collected.`);
    }

    function refreshOrders(animate) {
        const result = readOrders();
        if (!animate) {
            renderOrders(result);
            return;
        }
        $list.stop(true, true).fadeOut(150, function () {
            renderOrders(result);
            $(this).fadeIn(200);
        });
    }

    $refresh.on('click', function () {
        refreshOrders(true);
    });

    // Delegation lets the existing list handle toggle buttons that are created later for every saved order.
    $list.on('click', '.order-toggle', function () {
        const $button = $(this);
        const expanded = $button.attr('aria-expanded') === 'true';
        // This chain finds the containing card, locates its details, stops queued effects and toggles visibility.
        $button.closest('.order-card').find('.order-details').stop(true, true).slideToggle(200);
        $button.attr('aria-expanded', String(!expanded))
            .text(expanded ? 'Show order details' : 'Hide order details');
    });

    $(window).on('storage', function (event) {
        const originalEvent = event.originalEvent;
        if (originalEvent.key === storageKey || originalEvent.key === null) refreshOrders(true);
    });

    refreshOrders(false);
});
