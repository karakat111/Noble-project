"use strict";

// jQuery 3.7.1 must load first. ready() replaces waiting for DOMContentLoaded.
// Compared with the old version, $(), find(), each() and on() replace native DOM selection, loops and listeners.
$(document).ready(function () {
    const $filterForm = $("#catalog-filters");
    const $filterButtons = $filterForm.find("button[data-filter]:not(:disabled)");
    const $products = $filterForm.find(".product-item");
    const $filterStatus = $("#filter-help");
    const $emptyMessage = $("#filter-empty");
    const selected = { category: "all", price: "any" };
    const $search = $('<input>', {
        id: 'catalog-search', type: 'search', 'class': 'form-control mb-3',
        placeholder: 'Search products', 'aria-label': 'Search products by name'
    });
    $search.insertBefore($('#catalog-results'));
    $filterStatus.attr('role', 'status');
    $products.find('button[id^="add-"]').prop('disabled', false);
    $filterForm.on('click', 'button[id^="add-"]', function () {
        const id = $(this).attr('id').slice(4);
        const product = products.find(function (item) { return item.id === id; });
        if (!product) return;
        let cart;
        try {
            cart = readCart();
        } catch {
            $cartStatus.text('Could not read the saved cart. Your data has not been changed.');
            return;
        }
        const existing = cart.find(function (item) { return item.id === id; });
        if (existing && existing.quantity === 99) {
            $cartStatus.text('The maximum is 99 of this product. Change its quantity in your cart.');
            return;
        }
        if (existing) existing.quantity += 1;
        else cart.push({ id: id, quantity: 1 });
        if (!saveCart(cart)) {
            $cartStatus.text('Could not add the product. Allow browser storage and try again.');
            return;
        }
        $cartStatus.text(product.name + ' added to your cart.');
        $(this).text('Add another');
    });
    const $cartStatus = $('<p class="small mt-3" role="status"></p>');
    const $cartLink = $('<a class="btn btn-outline-secondary mb-3" href="cart.html">View cart →</a>');
    $('#catalog-results').before($cartStatus, $cartLink);
    let requested = new URLSearchParams(window.location.search).get('product');

    function applyFilters() {
        let visibleCount = 0;

        $products.each(function () {
            const $product = $(this);
            const price = Number($product.attr("data-price"));
            const matchesCategory = selected.category === "all" ||
                $product.attr("data-category") === selected.category;
            const matchesPrice = selected.price === "any" ||
                (selected.price === "under" && price <= 100000) ||
                (selected.price === "over" && price > 100000);
            const query = String($search.val()).trim().toLowerCase();
            const name = $product.find('h2, h3').first().text().toLowerCase();
            const productId = $product.find('button[id^="add-"]').attr('id').slice(4);
            const matchesRequested = requested === null || productId === requested;
            const visible = matchesCategory && matchesPrice && name.includes(query) && matchesRequested;

            $product.prop("hidden", !visible).toggleClass("d-none", !visible);
            if (visible) visibleCount += 1;
        });

        $filterButtons.each(function () {
            const $button = $(this);
            const group = $button.attr("data-filter");
            const isSelected = selected[group] === $button.val();

            $button.attr("aria-pressed", String(isSelected));
            if (isSelected && !$button.hasClass("fw-semibold")) {
                $button.addClass("fw-semibold");
            } else if (!isSelected && $button.hasClass("fw-semibold")) {
                $button.removeClass("fw-semibold");
            }
        });

        $emptyMessage.prop("hidden", visibleCount !== 0);
        $filterStatus.text(`Showing ${visibleCount} of ${$products.length} products.`);
    }

    $filterButtons.on("click", function () {
        const $button = $(this);
        selected[$button.attr("data-filter")] = $button.val();
        requested = null;
        applyFilters();
    });

    $filterForm.on("reset", function () {
        requested = null;
        $search.val('');
        selected.category = "all";
        selected.price = "any";
        applyFilters();
    });

    $search.on('input', function () {
        requested = null;
        applyFilters();
    });

    $filterForm.on("submit", function (event) {
        // Without preventDefault(), the form would reload the page and lose the chosen filters.
        event.preventDefault();
    });

    applyFilters();
});
