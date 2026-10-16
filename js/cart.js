const container = document.querySelector('#cart-items');
const shop = NobleShop;
const template = document.querySelector('#cart-item-template');
const message = document.querySelector('#cart-message');
const placeOrder = document.querySelector('#place-order');
const success = document.querySelector('#checkout-success');
const confirmation = shop.element('div', '', 'border rounded p-3 mt-3 state-hidden');
const summary = shop.element('p', '');
const confirm = shop.element('button', 'Confirm demo order', 'btn btn-secondary me-2');
const cancel = shop.element('button', 'Keep editing', 'btn btn-outline-secondary');
confirm.type = 'button';
cancel.type = 'button';
confirmation.append(summary, confirm, cancel);
placeOrder.after(confirmation);
const clear = shop.element('button', 'Clear cart', 'btn btn-outline-secondary mb-3');
clear.type = 'button';
container.after(clear);
message.setAttribute('role', 'status');
document.querySelector('#cart-help').textContent = 'Review your selected pieces and quantities. Prices are recorded project prices; this is a demonstration cart.';
document.querySelector('#checkout-help').textContent = 'No payment is collected and no request is sent to Noble. Demo orders are saved in this browser only.';
placeOrder.textContent = 'Review demo order';

function announce(text) {
    message.textContent = text + shop.storageMessage();
}

function createRow(item) {
    const product = shop.findProduct(item.id);
    const row = template.content.firstElementChild.cloneNode(true);
    row.querySelector('.cart-item-name').textContent = product.name;
    row.querySelector('.cart-item-price').textContent = shop.money(product.price) + ' each';
    row.querySelector('.cart-item-subtotal').textContent = 'Subtotal: ' + shop.money(product.price * item.quantity);
    const image = row.querySelector('img');
    image.src = 'images.jpg/catalog/' + product.id + '.png';
    image.alt = 'Illustration of ' + product.name;
    const quantity = row.querySelector('.cart-quantity');
    quantity.value = item.quantity;
    quantity.setAttribute('aria-label', 'Quantity of ' + product.name);
    quantity.dataset.itemId = product.id;
    quantity.dataset.action = 'quantity';
    quantity.addEventListener('input', () => {
        const next = Number(quantity.value);
        if (!Number.isInteger(next) || next < 1 || next > 99) {
            quantity.classList.add('is-invalid');
            quantity.setAttribute('aria-invalid', 'true');
            placeOrder.disabled = true;
            confirmation.classList.add('state-hidden');
            announce('Enter a whole quantity from 1 to 99 before checkout. The saved quantity has not changed.');
            return;
        }
        shop.setQuantity(product.id, next);
        announce(product.name + ': quantity updated to ' + next + '.');
    });
    const minus = shop.element('button', '−', 'btn btn-outline-secondary btn-sm');
    const plus = shop.element('button', '+', 'btn btn-outline-secondary btn-sm');
    for (const [button, delta, action] of [[minus, -1, 'decrease'], [plus, 1, 'increase']]) {
        button.type = 'button';
        button.dataset.itemId = product.id;
        button.dataset.action = action;
        button.setAttribute('aria-label', action + ' quantity of ' + product.name);
        button.disabled = delta === -1 ? item.quantity === 1 : item.quantity === 99;
        button.addEventListener('click', () => {
            shop.setQuantity(product.id, item.quantity + delta);
            announce(product.name + ': quantity updated to ' + (item.quantity + delta) + '.');
        });
    }
    quantity.closest('label').before(minus);
    quantity.closest('label').after(plus);
    const remove = row.querySelector('.cart-remove');
    remove.dataset.itemId = product.id;
    remove.dataset.action = 'remove';
    remove.setAttribute('aria-label', 'Remove ' + product.name);
    remove.addEventListener('click', () => {
        shop.setQuantity(product.id, 0);
        announce(product.name + ' removed.');
    });
    return row;
}

function renderCart() {
    const focused = document.activeElement;
    const id = focused?.dataset.itemId;
    const action = focused?.dataset.action;
    const items = shop.getCart();
    container.replaceChildren(...items.map(createRow));
    const total = shop.totals(items);
    document.querySelector('#cart-empty').classList.toggle('state-hidden', items.length !== 0);
    document.querySelector('#cart-item-count').textContent = total.quantity;
    document.querySelector('#cart-total').textContent = shop.money(total.price);
    placeOrder.disabled = items.length === 0;
    clear.disabled = items.length === 0;
    confirmation.classList.add('state-hidden');
    if (id) {
        const candidates = Array.from(container.querySelectorAll('button,input'));
        const replacement = candidates.find(node => node.dataset.itemId === id && node.dataset.action === action && !node.disabled);
        (replacement || candidates.find(node => !node.disabled) || document.querySelector('#cart-empty a')).focus();
    }
}

function reviewOrder() {
    const items = shop.getCart();
    if (items.length === 0) return;
    const total = shop.totals(items);
    summary.textContent = items.map(item => shop.findProduct(item.id).name + ' × ' + item.quantity).join('; ') +
        '. Total: ' + shop.money(total.price) + '. Confirm this demonstration? No real order or payment will be created.';
    confirmation.classList.remove('state-hidden');
    success.classList.add('state-hidden');
    confirm.focus();
}

function finishOrder() {
    const order = shop.checkout();
    if (!order) {
        announce('Your cart is empty. Add a product before checkout.');
        return;
    }
    document.querySelector('#checkout-success-text').textContent = order.reference + ': ' +
        order.items.map(item => shop.findProduct(item.id).name + ' × ' + item.quantity).join('; ') +
        '. Total: ' + shop.money(shop.totals(order.items).price) +
        '. Demonstration only: no real order, payment or request was created.' + shop.storageMessage();
    success.classList.remove('state-hidden');
    success.setAttribute('tabindex', '-1');
    success.focus();
    announce('Demo checkout complete. Cart cleared.');
}

clear.addEventListener('click', () => {
    shop.clear();
    success.classList.add('state-hidden');
    announce('Cart cleared.');
    document.querySelector('#cart-empty a').focus();
});
placeOrder.addEventListener('click', reviewOrder);
confirm.addEventListener('click', finishOrder);
cancel.addEventListener('click', () => {
    confirmation.classList.add('state-hidden');
    announce('Checkout cancelled. Your items are still in the cart.');
    placeOrder.focus();
});
document.addEventListener('noble-cart-change', renderCart);
renderCart();
announce('Cart ready.');

