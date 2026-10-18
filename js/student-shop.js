'use strict';

// Student A pages share the existing catalogue's recorded project prices.
const StudentShop = (() => {
    const products = [
        { id: 'mug', name: 'Mug', category: 'tableware', price: 120000 },
        { id: 'caviar-cup', name: 'Caviar cup', category: 'tableware', price: 220000 },
        { id: 'candle-holder', name: 'Lithophane candle holder', category: 'accessories', price: 78000 },
        { id: 'teapot', name: 'Teapot', category: 'serving', price: 144000 },
        { id: 'bowl', name: 'Bowl', category: 'tableware', price: 100000 },
        { id: 'jewelry-box', name: 'Jewelry box', category: 'accessories', price: 38000 },
        { id: 'pitcher', name: 'Pitcher', category: 'serving', price: 80000 },
        { id: 'saucer', name: 'Saucer', category: 'tableware', price: 58000 },
        { id: 'decanter', name: 'Decanter', category: 'serving', price: 85000 },
        { id: 'caviar-dish', name: 'Caviar dish', category: 'tableware', price: 65000 }
    ].map(product => Object.freeze(product));
    Object.freeze(products);

    function findProduct(id) {
        return products.find(product => product.id === id);
    }

    function money(value) {
        return value.toLocaleString('en-US') + ' ₸';
    }

    function element(tag, text = '', classes = '') {
        const node = document.createElement(tag);
        node.textContent = text;
        if (classes) node.classList.add(...classes.split(' '));
        return node;
    }

    function filterProducts(criteria) {
        const query = criteria.query.trim().toLowerCase();
        return products.filter(product =>
            (criteria.category === 'all' || product.category === criteria.category) &&
            (criteria.price === 'any' ||
                (criteria.price === 'under' && product.price <= 100000) ||
                (criteria.price === 'over' && product.price > 100000)) &&
            (product.name + ' ' + product.category).toLowerCase().includes(query));
    }

    function sortProducts(items, direction) {
        const result = [...items];
        if (direction === 'low') result.sort((a, b) => a.price - b.price);
        if (direction === 'high') result.sort((a, b) => b.price - a.price);
        return result;
    }

    function randomProduct(previousId) {
        const choices = products.filter(product => product.id !== previousId);
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function totals(items) {
        return items.reduce((sum, item) => ({
            quantity: sum.quantity + item.quantity,
            price: sum.price + item.unitPrice * item.quantity
        }), { quantity: 0, price: 0 });
    }

    return { products, findProduct, money, element, filterProducts, sortProducts, randomProduct, totals };
})();
