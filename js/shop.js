'use strict';

// Shared catalogue and cart API. Only product IDs and quantities are persisted.
const NobleShop = (() => {
    const products = [
        { id: 'mug', name: 'Mug', category: 'tableware', price: 120000, volume: '≈ 350 ml' },
        { id: 'caviar-cup', name: 'Caviar cup', category: 'tableware', price: 220000, volume: '≈ 100 ml' },
        { id: 'candle-holder', name: 'Lithophane candle holder', category: 'accessories', price: 78000, volume: 'Not applicable' },
        { id: 'teapot', name: 'Teapot', category: 'serving', price: 144000, volume: '≈ 1.2 L' },
        { id: 'bowl', name: 'Bowl', category: 'tableware', price: 100000, volume: '≈ 600 ml' },
        { id: 'jewelry-box', name: 'Jewelry box', category: 'accessories', price: 38000, volume: 'Not applicable' },
        { id: 'pitcher', name: 'Pitcher', category: 'serving', price: 80000, volume: '≈ 1.5 L' },
        { id: 'saucer', name: 'Saucer', category: 'tableware', price: 58000, volume: 'Not applicable' },
        { id: 'decanter', name: 'Decanter', category: 'serving', price: 85000, volume: '≈ 1 L' },
        { id: 'caviar-dish', name: 'Caviar dish', category: 'tableware', price: 65000, volume: '≈ 250 ml' }
    ];
    const key = 'noble-demo-shop-v1';
    let storageAvailable = true;

    function findProduct(id) {
        return products.find(product => product.id === id);
    }

    function validItems(items) {
        if (!Array.isArray(items)) return [];
        const result = [];
        for (const item of items) {
            if (item && findProduct(item.id) && Number.isInteger(item.quantity) &&
                item.quantity >= 1 && item.quantity <= 99 && !result.some(row => row.id === item.id)) {
                result.push({ id: item.id, quantity: item.quantity });
            }
        }
        return result;
    }

    function readState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
            return {
                cart: validItems(parsed?.cart),
                orders: Array.isArray(parsed?.orders) ? parsed.orders.filter(order =>
                    order && typeof order.reference === 'string' &&
                    /^DEMO-[A-Z0-9-]+$/.test(order.reference) &&
                    typeof order.date === 'string' && !Number.isNaN(Date.parse(order.date)) &&
                    validItems(order.items).length > 0
                ).slice(0, 30).map(order => ({
                    reference: order.reference, date: order.date, items: validItems(order.items)
                })) : []
            };
        } catch {
            storageAvailable = false;
            return { cart: [], orders: [] };
        }
    }

    let state = readState();

    function money(value) {
        return value.toLocaleString('en-US') + ' ₸';
    }

    function totals(items) {
        return items.reduce((sum, item) => {
            const product = findProduct(item.id);
            return { quantity: sum.quantity + item.quantity, price: sum.price + product.price * item.quantity };
        }, { quantity: 0, price: 0 });
    }

    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(state));
            storageAvailable = true;
        } catch {
            storageAvailable = false;
        }
        document.dispatchEvent(new Event('noble-cart-change'));
        return storageAvailable;
    }

    function setQuantity(id, quantity) {
        if (!findProduct(id) || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) return false;
        const item = state.cart.find(row => row.id === id);
        if (quantity === 0) {
            state.cart = state.cart.filter(row => row.id !== id);
        } else if (item) {
            item.quantity = quantity;
        } else {
            state.cart.push({ id, quantity });
        }
        save();
        return true;
    }

    function add(id) {
        const existing = state.cart.find(item => item.id === id);
        return setQuantity(id, existing ? existing.quantity + 1 : 1);
    }

    function clear() {
        state.cart = [];
        return save();
    }

    function checkout() {
        if (state.cart.length === 0) return null;
        const order = {
            reference: 'DEMO-' + Date.now().toString(36).toUpperCase() + '-' +
                Math.floor(Math.random() * 90000 + 10000),
            date: new Date().toISOString(),
            items: state.cart.map(item => ({ ...item }))
        };
        state.orders.unshift(order);
        state.orders = state.orders.slice(0, 30);
        state.cart = [];
        save();
        return order;
    }

    function element(tag, text, classes = '') {
        const node = document.createElement(tag);
        node.textContent = text;
        if (classes) node.classList.add(...classes.split(' '));
        return node;
    }

    function storageMessage() {
        return storageAvailable ? '' : ' Browser storage is unavailable; changes last only on this page.';
    }

    function updateBadge() {
        document.querySelectorAll('.navigation-actions a[href="cart.html"]').forEach(link => {
            let badge = link.querySelector('.cart-count');
            if (!badge) {
                badge = element('span', '', 'cart-count badge text-bg-secondary ms-2');
                link.append(badge);
            }
            const count = totals(state.cart).quantity;
            badge.textContent = String(count);
            link.setAttribute('aria-label', 'Shopping cart: ' + count + ' items');
        });
    }

    document.addEventListener('noble-cart-change', updateBadge);
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) {
            state = readState();
            document.dispatchEvent(new Event('noble-cart-change'));
            document.dispatchEvent(new Event('noble-orders-change'));
        }
    });
    updateBadge();

    return { products, findProduct, money, totals, setQuantity, add, clear, checkout,
        element, storageMessage, getCart: () => state.cart.map(item => ({ ...item })),
        getOrders: () => state.orders.map(order => ({ ...order, items: order.items.map(item => ({ ...item })) })) };
})();

