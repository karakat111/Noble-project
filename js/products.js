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
        window.location.assign('cart.html?product=' + encodeURIComponent(id));
    });
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
