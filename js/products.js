"use strict";

const filterForm = document.querySelector("#catalog-filters");
const filterButtons = [...filterForm.querySelectorAll("[data-filter]")];
const products = [...filterForm.querySelectorAll(".product-item")];
const filterStatus = document.querySelector("#filter-help");
const emptyMessage = document.querySelector("#filter-empty");
const selected = { category: "all", price: "any" };

function applyFilters() {
    let visibleCount = 0;

    products.forEach((product) => {
        const price = Number(product.dataset.price);
        const matchesCategory = selected.category === "all" ||
            product.dataset.category === selected.category;
        const matchesPrice = selected.price === "any" ||
            (selected.price === "under" && price <= 100000) ||
            (selected.price === "over" && price > 100000);

        // Both filters must match. Hide the whole column so the grid has no gaps.
        const visible = matchesCategory && matchesPrice;
        product.hidden = !visible;
        product.classList.toggle("d-none", !visible);
        if (visible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed",
            String(selected[button.dataset.filter] === button.value));
    });
    emptyMessage.hidden = visibleCount !== 0;
    filterStatus.textContent = `Showing ${visibleCount} of ${products.length} products.`;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Changing one group preserves the other group's selection.
        selected[button.dataset.filter] = button.value;
        applyFilters();
    });
});

filterForm.addEventListener("reset", () => {
    selected.category = "all";
    selected.price = "any";
    applyFilters();
});

// Filtering stays on this page without submitting the form or reloading.
filterForm.addEventListener("submit", (event) => event.preventDefault());
applyFilters();
