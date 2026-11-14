// Plain JavaScript: this feature does not use jQuery.
let cart = [];

const items = document.querySelector('#cart-items');
const message = document.querySelector('#cart-message');
const orderButton = document.querySelector('#place-order');

function findProduct(id) {
    return products.find(function (product) { return product.id === id; });
}

function formatPrice(price) {
    return price.toLocaleString('en-US') + ' ₸';
}

function validQuantity(value) {
    return Number.isInteger(value) && value >= 1 && value <= 99;
}

function calculateTotal(list) {
    let total = 0;
    for (const item of list) {
        total += findProduct(item.id).price * item.quantity;
    }
    return total;
}

function updateTotal() {
    let count = 0;
    let valid = true;
    for (const item of cart) {
        if (!validQuantity(item.quantity)) valid = false;
        count += item.quantity;
    }
    document.querySelector('#cart-total').textContent = valid ? formatPrice(calculateTotal(cart)) : '—';
    document.querySelector('#cart-item-count').textContent = valid ? count : '—';
    document.querySelector('#checkout-error').classList.toggle('state-hidden', valid);
    document.querySelector('#cart-empty').classList.toggle('state-hidden', cart.length > 0);
    orderButton.disabled = cart.length === 0 || !valid;
}

function renderCart() {
    items.replaceChildren();
    for (const item of cart) {
        const product = findProduct(item.id);
        const row = document.createElement('article');
        row.className = 'cart-item';
        row.dataset.product = product.id;
        // Only fixed markup is parsed. Product text is assigned with textContent.
        row.innerHTML = '<img class="cart-product-image" alt="">' +
            '<div class="cart-product-info"><p class="eyebrow">NOBLE TABLEWARE</p>' +
            '<h3 class="cart-name"></h3><p class="cart-unit-price"></p>' +
            '<p class="small mb-0 cart-subtotal"></p>' +
            '<p class="state-error state-hidden small mt-2 cart-error">Enter 1–99 whole pieces.</p></div>' +
            '<div class="cart-product-controls"><label>Quantity ' +
            '<input class="form-control cart-quantity" type="number" min="1" max="99" step="1" required></label>' +
            '<button type="button" class="cart-remove">Remove</button></div>';
        row.querySelector('img').src = 'images.jpg/catalog/' + product.id + '.png';
        row.querySelector('img').alt = product.name;
        row.querySelector('.cart-name').textContent = product.name;
        row.querySelector('.cart-unit-price').textContent = formatPrice(product.price) + ' each';
        row.querySelector('.cart-quantity').value = item.quantity;
        row.querySelector('.cart-error').id = 'quantity-error-' + product.id;
        updateRow(row, item);
        items.append(row);
    }
    updateTotal();
}

function updateRow(row, item) {
    const valid = validQuantity(item.quantity);
    row.querySelector('.cart-quantity').classList.toggle('is-invalid', !valid);
    row.querySelector('.cart-error').classList.toggle('state-hidden', valid);
    row.querySelector('.cart-subtotal').textContent = valid ?
        'Subtotal: ' + formatPrice(findProduct(item.id).price * item.quantity) : 'Subtotal: —';
}

function changeQuantity(event) {
    if (!event.target.matches('.cart-quantity')) return;
    const row = event.target.closest('.cart-item');
    const item = cart.find(function (entry) { return entry.id === row.dataset.product; });
    item.quantity = Number(event.target.value);
    updateRow(row, item);
    updateTotal();
    if (cart.every(function (entry) { return validQuantity(entry.quantity); })) {
        message.textContent = saveCart(cart) ? '' : 'Could not save changes. Allow browser storage and try again.';
    } else {
        message.textContent = 'Correct the quantity. Your last valid cart is still saved.';
    }
}

function removeItem(event) {
    if (!event.target.matches('.cart-remove')) return;
    const row = event.target.closest('.cart-item');
    const product = findProduct(row.dataset.product);
    cart = cart.filter(function (item) { return item.id !== product.id; });
    renderCart();
    if (!cart.every(function (item) { return validQuantity(item.quantity); })) {
        message.textContent = 'Correct the remaining quantities to save your changes.';
        return;
    }
    message.textContent = saveCart(cart) ? product.name + ' removed.' :
        'Could not save removal. Allow browser storage and try again.';
}

function placeOrder() {
    updateTotal();
    if (orderButton.disabled) return;
    const total = calculateTotal(cart);
    const reference = saveOrder(cart);
    if (!reference) {
        message.textContent = 'Could not save the order. Your cart is unchanged. Check browser storage or the history message in My Orders.';
        return;
    }
    cart = [];
    renderCart();
    message.textContent = 'Your order was saved on this device. Total: ' + formatPrice(total) +
        '. No order or payment was sent to the store.';
}

// Delegation: the container handles cards created later by renderCart().
items.addEventListener('click', removeItem);
items.addEventListener('input', changeQuantity);
orderButton.addEventListener('click', placeOrder);
try {
    cart = readCart();
} catch {
    message.textContent = 'Saved cart could not be read. If storage is available, adding a product in the catalogue starts a new cart.';
}
renderCart();
