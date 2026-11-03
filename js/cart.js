// Plain JavaScript: this feature does not use jQuery.
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
let cart = [];
let orderNumber = 0;

const items = document.querySelector('#cart-items');
const select = document.querySelector('#cart-product');
const message = document.querySelector('#cart-message');
const orderButton = document.querySelector('#place-order');
const receipt = document.createElement('section');
receipt.className = 'state-success state-hidden mt-3';
receipt.setAttribute('aria-label', 'Completed demo order');
message.after(receipt);

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

// Build the chooser from the same data as the cards.
select.replaceChildren();
for (const product of products) {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name + ' — ' + formatPrice(product.price);
    select.append(option);
}
document.querySelector('.order-panel .fine-print').textContent =
    'Demo only: no payment or order is sent. Cart and receipt clear on reload.';
document.querySelector('#checkout-error').textContent =
    'Correct the highlighted quantities before checkout.';

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
        row.querySelector('img').alt = 'Illustration of ' + product.name;
        row.querySelector('.cart-name').textContent = product.name;
        row.querySelector('.cart-unit-price').textContent = formatPrice(product.price) + ' each';
        row.querySelector('.cart-quantity').value = item.quantity;
        row.querySelector('.cart-quantity').setAttribute('aria-label', 'Quantity of ' + product.name);
        row.querySelector('.cart-error').id = 'quantity-error-' + product.id;
        row.querySelector('.cart-quantity').setAttribute('aria-describedby', 'quantity-error-' + product.id);
        updateRow(row, item);
        items.append(row);
    }
    updateTotal();
}

function updateRow(row, item) {
    const valid = validQuantity(item.quantity);
    row.querySelector('.cart-quantity').classList.toggle('is-invalid', !valid);
    row.querySelector('.cart-quantity').setAttribute('aria-invalid', String(!valid));
    row.querySelector('.cart-error').classList.toggle('state-hidden', valid);
    row.querySelector('.cart-subtotal').textContent = valid ?
        'Subtotal: ' + formatPrice(findProduct(item.id).price * item.quantity) : 'Subtotal: —';
}

function addProduct() {
    const product = findProduct(select.value);
    if (!product) return;
    const existing = cart.find(function (item) { return item.id === product.id; });
    if (existing) {
        if (!validQuantity(existing.quantity) || existing.quantity === 99) {
            message.textContent = 'Check the quantity for ' + product.name + '. The maximum is 99.';
            return;
        }
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }
    renderCart();
    message.textContent = product.name + ' added.';
}

function changeQuantity(event) {
    if (!event.target.matches('.cart-quantity')) return;
    const row = event.target.closest('.cart-item');
    const item = cart.find(function (entry) { return entry.id === row.dataset.product; });
    item.quantity = Number(event.target.value);
    updateRow(row, item);
    updateTotal();
    message.textContent = '';
}

function removeItem(event) {
    if (!event.target.matches('.cart-remove')) return;
    const row = event.target.closest('.cart-item');
    const product = findProduct(row.dataset.product);
    cart = cart.filter(function (item) { return item.id !== product.id; });
    renderCart();
    message.textContent = product.name + ' removed.';
    document.querySelector('#add-to-cart').focus();
}

function placeOrder() {
    updateTotal();
    if (orderButton.disabled) return;
    orderNumber += 1;
    receipt.replaceChildren();
    const heading = document.createElement('h3');
    heading.className = 'h5';
    heading.textContent = 'Demo order ' + orderNumber + ' completed';
    const list = document.createElement('ul');
    for (const item of cart) {
        const product = findProduct(item.id);
        const line = document.createElement('li');
        line.textContent = product.name + ' × ' + item.quantity + ' — ' + formatPrice(product.price * item.quantity);
        list.append(line);
    }
    const total = document.createElement('p');
    total.className = 'fw-semibold';
    total.textContent = 'Total: ' + formatPrice(calculateTotal(cart));
    const note = document.createElement('p');
    note.className = 'small mb-0';
    note.textContent = 'Receipt for this page only. Not saved in My Orders. No payment or request was sent.';
    receipt.append(heading, list, total, note);
    receipt.classList.remove('state-hidden');
    cart = [];
    renderCart();
    message.textContent = 'Demo order completed. Your cart is now empty.';
    receipt.tabIndex = -1;
    receipt.focus();
}

document.querySelector('#add-to-cart').addEventListener('click', addProduct);
// Delegation: the container handles cards created later by renderCart().
items.addEventListener('click', removeItem);
items.addEventListener('input', changeQuantity);
orderButton.addEventListener('click', placeOrder);
renderCart();
