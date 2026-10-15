'use strict';

const products = [
  { id: 1, name: 'Porcelain Tea Set',    category: 'tea-coffee',    price: 24000, inStock: true,  imageAlt: 'White porcelain tea set' },
  { id: 2, name: 'Ceramic Coffee Mug',   category: 'tea-coffee',    price: 3500,  inStock: true,  imageAlt: 'Ceramic coffee mug' },
  { id: 3, name: 'Dinner Plate Set',     category: 'table-setting', price: 18000, inStock: true,  imageAlt: 'Set of dinner plates' },
  { id: 4, name: 'Linen Table Runner',   category: 'table-setting', price: 6500,  inStock: false, imageAlt: 'Linen table runner' },
  { id: 5, name: 'Glass Decorative Vase', category: 'decorative',   price: 9000,  inStock: true,  imageAlt: 'Glass vase' },
  { id: 6, name: 'Candle Holder Pair',   category: 'decorative',    price: 5200,  inStock: true,  imageAlt: 'Pair of candle holders' }
];

const list = document.querySelector('#product-list');
const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const resetButton = document.querySelector('#reset');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');

function filterProducts(category, searchText) {
  return products.filter(function (p) {
    return (category === 'all' || p.category === category) &&
      p.name.toLowerCase().includes(searchText.trim().toLowerCase());
  });
}

function createCard(item) {
const card = document.createElement('article');
const title = document.createElement('h3');
const price = document.createElement('p');
const stock = document.createElement('p');


card.classList.add('collection-card');
title.classList.add('collection-card-title');
price.classList.add('collection-card-price');
stock.classList.add('collection-card-stock');

title.textContent = item.name;
price.textContent = item.price.toLocaleString('en-US') + ' KZT';

stock.textContent = item.inStock ? 'In stock' : 'Out of stock';
stock.classList.add(item.inStock ? 'in-stock' : 'out-of-stock');

card.appendChild(title);
card.appendChild(price);
card.appendChild(stock);

return card;


}


function renderCards(array, container) {
  container.textContent = '';
  array.forEach(function (item) {
    container.appendChild(createCard(item));
  });
}

function update() {
  const filtered = filterProducts(categorySelect.value, searchInput.value);
  renderCards(filtered, list);
  resultCount.textContent = 'Found: ' + filtered.length;
  if (filtered.length === 0) {
    emptyState.classList.remove('state-hidden');
  } else {
    emptyState.classList.add('state-hidden');
  }
}

if (list !== null) {
  searchInput.addEventListener('input', update);
  categorySelect.addEventListener('change', update);
  resetButton.addEventListener('click', function () {
    searchInput.value = '';
    categorySelect.value = 'all';
    update();
  });
  update();
}
