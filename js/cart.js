// jQuery 3.7.1 full build includes effects. Ready waits until the page's HTML is available.
$(function () {
    // Rewrite 1: $(), .on(), .find(), .text(), .val() and .prop() replace querySelector,
    // addEventListener and DOM properties. Delegation simplifies newly created cards.
    const products = [
        ['Mug', 120000], ['Caviar cup', 220000], ['Lithophane candle holder', 78000],
        ['Teapot', 144000], ['Bowl', 100000], ['Jewelry box', 38000],
        ['Pitcher', 80000], ['Saucer', 58000], ['Decanter', 85000], ['Caviar dish', 65000]
    ];
    const items = $('#cart-items');
    const select = $('#cart-product');
    const message = $('#cart-message');
    const orderButton = $('#place-order');

    function updateTotal() {
        let sum = 0;
        let count = 0;
        let valid = true;
        const rows = items.find('.cart-item:not([data-removing])');
        rows.each(function () {
            const row = $(this);
            const input = row.find('.cart-quantity');
            const quantity = Number(input.val());
            const correct = Number.isInteger(quantity) && quantity >= 1;
            input.toggleClass('is-invalid', !correct).attr('aria-invalid', String(!correct));
            if (correct) {
                sum += Number(row.find('.cart-price').text()) * quantity;
                count += quantity;
            } else {
                valid = false;
            }
        });
        $('#cart-total').text(valid ? sum.toLocaleString('en-US') + ' ₸' : '—');
        $('#cart-item-count').text(valid ? count : '—');
        $('#checkout-error').toggleClass('state-hidden', valid);
        $('#cart-empty').toggleClass('state-hidden', rows.length > 0);
        orderButton.prop('disabled', rows.length === 0 || !valid);
        message.text('');
    }

    function addProduct() {
        // HTML options and this array use the same order (starting at index 0).
        const index = select.prop('selectedIndex');
        const product = products[index];
        // Card markup lives only in this script; its data comes from the array above.
        const row = $('<article class="cart-item border rounded p-3 mb-3">' +
            '<h3 class="h5 cart-name"></h3>' +
            '<p><span class="cart-price"></span> ₸ each</p>' +
            '<label>Quantity <input class="form-control cart-quantity mb-2" type="number" min="1" step="1" value="1" required></label> ' +
            '<button type="button" class="btn btn-outline-secondary btn-sm cart-remove">Remove</button></article>');
        row.find('.cart-name').text(product[0]);
        row.find('.cart-price').text(product[1]);
        // Chain: append the card, collapse it immediately, then reveal the added item.
        row.appendTo(items).slideUp(0).slideDown(200);
        updateTotal();
        message.text(product[0] + ' added to the cart.');
    }

    function removeItem() {
        const row = $(this).closest('.cart-item');
        // Disable the clicked card while its removal effect runs.
        row.find('input, button').prop('disabled', true);
        row.attr('data-removing', 'true');
        updateTotal();
        row.slideUp(200, function () {
            // Callback: remove the node only after the visitor sees it slide away.
            $(this).remove();
            updateTotal();
            message.text('Item removed.');
        });
    }

    function placeOrder() {
        updateTotal();
        if (orderButton.prop('disabled')) return;
        message.text('Demo complete! Total: ' + $('#cart-total').text() +
            '. No real order was sent and no payment was collected.');
    }

    $('#add-to-cart').on('click', addProduct);
    // Delegation listens on the existing container. Direct binding before addProduct()
    // would find no .cart-remove buttons and would miss cards created afterwards.
    items.on('click', '.cart-remove', removeItem);
    items.on('input', '.cart-quantity', updateTotal);
    orderButton.on('click', placeOrder);
    updateTotal();
});

