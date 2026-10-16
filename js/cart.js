// Product data from the existing catalogue.
const products = [
    { id: 'mug', name: 'Mug', price: 120000, category: 'tableware' },
    { id: 'caviar-cup', name: 'Caviar cup', price: 220000, category: 'tableware' },
    { id: 'candle-holder', name: 'Lithophane candle holder', price: 78000, category: 'accessories' },
    { id: 'teapot', name: 'Teapot', price: 144000, category: 'serving' },
    { id: 'bowl', name: 'Bowl', price: 100000, category: 'tableware' },
    { id: 'jewelry-box', name: 'Jewelry box', price: 38000, category: 'accessories' },
    { id: 'pitcher', name: 'Pitcher', price: 80000, category: 'serving' },
    { id: 'saucer', name: 'Saucer', price: 58000, category: 'tableware' },
    { id: 'decanter', name: 'Decanter', price: 85000, category: 'serving' },
    { id: 'caviar-dish', name: 'Caviar dish', price: 65000, category: 'tableware' }
];
let cart = [];

const container = document.querySelector('#cart-items');
const template = document.querySelector('#cart-item-template');
const message = document.querySelector('#cart-message');
const placeOrder = document.querySelector('#place-order');
const success = document.querySelector('#checkout-success');
const error = document.querySelector('#checkout-error');

// Create a product selector without rewriting the HTML layout.
const label = document.createElement('label');
label.textContent = 'Choose a product';
label.htmlFor = 'cart-product';
label.classList.add('form-label');
const select = document.createElement('select');
select.id = 'cart-product';
select.classList.add('form-select', 'mb-2');
for (const product of products) {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name + ' — ' + formatPrice(product.price);
    select.append(option);
}
const addButton = document.createElement('button');
addButton.type = 'button';
addButton.textContent = 'Add to cart';
addButton.classList.add('btn', 'btn-secondary', 'mb-3');
document.querySelector('#cart-empty').before(label, select, addButton);
const clearButton = document.createElement('button');
clearButton.type = 'button';
clearButton.textContent = 'Clear cart';
clearButton.classList.add('btn', 'btn-outline-secondary', 'mb-3');
container.after(clearButton);

message.setAttribute('role', 'status');
error.setAttribute('role', 'alert');
success.setAttribute('role', 'status');
document.querySelector('#cart-help').textContent = 'Choose products and review your quantities. This practice cart resets when you reload or leave the page.';
document.querySelector('#checkout-help').textContent = 'Prices are recorded project prices. Demo checkout sends nothing to Noble and collects no payment.';
placeOrder.textContent = 'Complete demo order';
// There is no order-history feature in this simple version.
document.querySelector('#checkout-success a').classList.add('state-hidden');
const ordersLink = document.querySelector('a.d-block[href="order.html"]');
ordersLink.classList.remove('d-block');
ordersLink.classList.add('state-hidden');

function formatPrice(price) {
    return price.toLocaleString('en-US') + ' ₸';
}

function findProduct(id) {
    for (const product of products) {
        if (product.id === id) return product;
    }
    return null;
}

function calculateTotal(items) {
    let total = 0;
    for (const item of items) {
        total += findProduct(item.id).price * item.quantity;
    }
    return total;
}

function validQuantity(value) {
    return Number.isInteger(value) && value >= 1 && value <= 99;
}

function updateTotals() {
    let count = 0;
    for (const item of cart) count += item.quantity;
    document.querySelector('#cart-item-count').textContent = count;
    document.querySelector('#cart-total').textContent = formatPrice(calculateTotal(cart));
    const invalid = container.querySelector('.is-invalid');
    placeOrder.disabled = cart.length === 0 || invalid !== null;
    error.classList.toggle('state-hidden', invalid === null);
    error.textContent = 'Enter a whole quantity from 1 to 99. The total uses the last valid quantities until you correct the fields.';
}

function addProduct() {
    const product = findProduct(select.value);
    if (!product) return;
    let existing = null;
    for (const item of cart) {
        if (item.id === product.id) existing = item;
    }
    if (existing !== null) {
        if (existing.quantity === 99) {
            message.textContent = 'Maximum quantity: 99 per product.';
            return;
        }
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }
    success.classList.add('state-hidden');
    renderCart();
    message.textContent = product.name + ' added to the cart.';
}

function removeProduct(id) {
    for (let index = 0; index < cart.length; index++) {
        if (cart[index].id === id) {
            cart.splice(index, 1);
            break;
        }
    }
    renderCart();
    message.textContent = findProduct(id).name + ' removed.';
    addButton.focus();
}

function createRow(item) {
    const product = findProduct(item.id);
    const row = template.content.firstElementChild.cloneNode(true);
    row.querySelector('.cart-item-name').textContent = product.name;
    row.querySelector('.cart-item-price').textContent = formatPrice(product.price) + ' each';
    const subtotal = row.querySelector('.cart-item-subtotal');
    subtotal.textContent = 'Subtotal: ' + formatPrice(product.price * item.quantity);
    const image = row.querySelector('img');
    image.src = 'images.jpg/catalog/' + product.id + '.png';
    image.alt = 'Illustration of ' + product.name;
    const quantity = row.querySelector('.cart-quantity');
    quantity.value = item.quantity;
    quantity.setAttribute('aria-label', 'Quantity of ' + product.name);

    function changeQuantity() {
        const next = Number(quantity.value);
        const valid = validQuantity(next);
        quantity.classList.toggle('is-invalid', !valid);
        quantity.setAttribute('aria-invalid', String(!valid));
        if (valid) {
            item.quantity = next;
            subtotal.textContent = 'Subtotal: ' + formatPrice(product.price * next);
            message.textContent = product.name + ': quantity updated to ' + next + '.';
        } else {
            message.textContent = 'Correct the quantity of ' + product.name + '.';
        }
        updateTotals();
    }

    function removeThisProduct() {
        removeProduct(product.id);
    }

    quantity.addEventListener('input', changeQuantity);
    row.querySelector('.cart-remove').addEventListener('click', removeThisProduct);
    return row;
}

function renderCart() {
    container.replaceChildren();
    for (const item of cart) container.append(createRow(item));
    document.querySelector('#cart-empty').classList.toggle('state-hidden', cart.length > 0);
    clearButton.disabled = cart.length === 0;
    updateTotals();
}

function clearCart() {
    cart = [];
    renderCart();
    success.classList.add('state-hidden');
    message.textContent = 'Cart cleared.';
    addButton.focus();
}

function checkout() {
    if (cart.length === 0 || container.querySelector('.is-invalid') !== null) return;
    let summary = '';
    for (const item of cart) {
        summary += findProduct(item.id).name + ' × ' + item.quantity + '; ';
    }
    const reference = 'DEMO-' + Math.floor(Math.random() * 90000 + 10000);
    document.querySelector('#checkout-success-text').textContent = reference + ': ' + summary +
        'Total: ' + formatPrice(calculateTotal(cart)) + '. Demonstration only. No real order or payment was created. This result is not saved.';
    cart = [];
    renderCart();
    success.classList.remove('state-hidden');
    message.textContent = 'Demo checkout complete. Cart cleared.';
}

addButton.addEventListener('click', addProduct);
clearButton.addEventListener('click', clearCart);
placeOrder.addEventListener('click', checkout);
renderCart();
