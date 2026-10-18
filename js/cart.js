const select = document.querySelector('#cart-product');
const addButton = document.querySelector('#add-to-cart');
const template = document.querySelector('#cart-item-template');
const items = document.querySelector('#cart-items');
const total = document.querySelector('#cart-total');
const count = document.querySelector('#cart-item-count');
const empty = document.querySelector('#cart-empty');
const error = document.querySelector('#checkout-error');
const message = document.querySelector('#cart-message');
const orderButton = document.querySelector('#place-order');

function addProduct() {
    const product = select.options[select.selectedIndex];
    const row = template.content.firstElementChild.cloneNode(true);
    row.querySelector('.cart-name').textContent = product.textContent;
    row.querySelector('.cart-price').textContent = product.dataset.price;
    row.querySelector('.cart-quantity').addEventListener('input', updateTotal);
    row.querySelector('.cart-remove').addEventListener('click', removeItem);
    items.append(row);
    updateTotal();
    message.textContent = product.textContent + ' added to the cart.';
}

function updateTotal() {
    const rows = items.querySelectorAll('.cart-item');
    let sum = 0;
    let quantityTotal = 0;
    let valid = true;

    for (const row of rows) {
        const input = row.querySelector('.cart-quantity');
        const quantity = Number(input.value);
        const price = Number(row.querySelector('.cart-price').textContent);

        if (!Number.isInteger(quantity) || quantity < 1) {
            valid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            sum += price * quantity;
            quantityTotal += quantity;
        }
    }

    if (valid) {
        total.textContent = sum.toLocaleString('en-US') + ' ₸';
        count.textContent = quantityTotal;
    } else {
        total.textContent = '—';
        count.textContent = '—';
    }

    error.classList.toggle('state-hidden', valid);
    empty.classList.toggle('state-hidden', rows.length > 0);
    orderButton.disabled = rows.length === 0 || !valid;
    message.textContent = '';
}

function removeItem(event) {
    const row = event.currentTarget.closest('.cart-item');
    row.remove();
    updateTotal();
    message.textContent = 'Item removed.';
}

function placeOrder() {
    updateTotal();
    if (orderButton.disabled) return;
    message.textContent = 'Demo complete! Total: ' + total.textContent +
        '. No real order was sent and no payment was collected.';
}

addButton.addEventListener('click', addProduct);
orderButton.addEventListener('click', placeOrder);
updateTotal();


