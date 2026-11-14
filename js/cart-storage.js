const products = [
    { id: 'mug', name: 'Mug', price: 120000 },
    { id: 'caviar-cup', name: 'Caviar cup', price: 220000 },
    { id: 'candle-holder', name: 'Lithophane candle holder', price: 78000 },
    { id: 'teapot', name: 'Teapot', price: 144000 },
    { id: 'bowl', name: 'Bowl', price: 100000 },
    { id: 'jewelry-box', name: 'Jewelry box', price: 38000 },
    { id: 'pitcher', name: 'Pitcher', price: 80000 },
    { id: 'saucer', name: 'Saucer', price: 58000 },
    { id: 'decanter', name: 'Decanter', price: 85000 },
    { id: 'caviar-dish', name: 'Caviar dish', price: 65000 }
];

const cartStorageKey = 'noble-cart-v1';
const shopStorageKey = 'noble-demo-shop-v1';

function readShopState() {
    const state = JSON.parse(localStorage.getItem(shopStorageKey) || '{"orders":[]}');
    if (!state || typeof state !== 'object' || Array.isArray(state) || !Array.isArray(state.orders)) {
        throw new Error('Invalid saved history');
    }
    return state;
}

// Store only known product IDs and valid quantities, never prices from storage.
function readCart() {
    const state = readShopState();
    // Keep carts saved by the previous version until their first update.
    const saved = state.cart === undefined ?
        JSON.parse(localStorage.getItem(cartStorageKey) || '[]') : state.cart;
    if (!Array.isArray(saved)) throw new Error('Invalid saved cart');
    const result = [];
    for (const item of saved) {
        if (!item || !products.some(function (product) { return product.id === item.id; }) ||
            !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 ||
            result.some(function (entry) { return entry.id === item.id; })) {
            throw new Error('Invalid saved cart');
        }
        result.push({ id: item.id, quantity: item.quantity });
    }
    return result;
}

function saveCart(list) {
    try {
        const state = readShopState();
        state.cart = list;
        localStorage.setItem(shopStorageKey, JSON.stringify(state));
        return true;
    } catch {
        return false;
    }
}

function saveOrder(list) {
    try {
        if (list.length === 0) return null;
        const state = readShopState();
        const order = {
            reference: 'ORDER-' + crypto.randomUUID().toUpperCase(),
            date: new Date().toISOString(),
            items: []
        };
        for (const item of list) {
            const product = products.find(function (entry) { return entry.id === item.id; });
            if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return null;
            order.items.push({ id: product.id, name: product.name, quantity: item.quantity, unitPrice: product.price });
        }
        state.orders.unshift(order);
        state.cart = [];
        // One write saves the order AND clears the cart: either both succeed or neither does.
        localStorage.setItem(shopStorageKey, JSON.stringify(state));
        return order.reference;
    } catch {
        return null;
    }
}
