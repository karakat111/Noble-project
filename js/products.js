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
            const visible = matchesCategory && matchesPrice;

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
        applyFilters();
    });

    $filterForm.on("reset", function () {
        selected.category = "all";
        selected.price = "any";
        applyFilters();
    });

    $filterForm.on("submit", function (event) {
        // Without preventDefault(), the form would reload the page and lose the chosen filters.
        event.preventDefault();
    });

    applyFilters();
});
