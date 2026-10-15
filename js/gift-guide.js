'use strict';

const occasions = [
  { id: 1, title: 'Wedding',      description: 'Elegant sets for newlyweds.',     priceRangeKZT: '15 000 - 60 000', imageTag: 'wedding' },
  { id: 2, title: 'Housewarming', description: 'Practical pieces for a new home.', priceRangeKZT: '8 000 - 30 000',  imageTag: 'home' },
  { id: 3, title: 'Birthday',     description: 'Small personal gifts.',            priceRangeKZT: '5 000 - 20 000',  imageTag: 'birthday' },
  { id: 4, title: 'Nauryz',       description: 'Festive table settings.',          priceRangeKZT: '10 000 - 40 000', imageTag: 'nauryz' },
  { id: 5, title: 'Corporate',    description: 'Branded tea and coffee sets.',     priceRangeKZT: '7 000 - 35 000',  imageTag: 'corporate' },
  { id: 6, title: 'Anniversary',  description: 'Pairs and matching sets.',         priceRangeKZT: '12 000 - 50 000', imageTag: 'anniversary' }
];

const form = document.querySelector('#gift-form');
const confirmation = document.querySelector('#confirmation');
const featured = document.querySelector('#featured-occasion');
const perItem = document.querySelector('#budget-per-item');

function getRandomFeaturedItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function calculateBudgetPerItem(budget, quantity) {
  if (quantity === 0) {
    return null;
  }
  return budget / quantity;
}

function createOccasionCard(item) {
  const card = document.createElement('div');
  const title = document.createElement('h3');
  const text = document.createElement('p');
  title.textContent = item.title;
  text.textContent = item.description + ' (' + item.priceRangeKZT + ' KZT)';
  card.appendChild(title);
  card.appendChild(text);
  return card;
}

function renderFeatured() {
  if (featured === null) { return; }
  featured.textContent = '';
  featured.appendChild(createOccasionCard(getRandomFeaturedItem(occasions)));
}

function updateBudgetPerItem() {
  const budget = Number(form.querySelector('#budget').value);
  const quantity = Number(form.querySelector('#quantity').value);
  const result = calculateBudgetPerItem(budget, quantity);
  if (result === null || budget <= 0) {
    perItem.textContent = '';
    return;
  }
  perItem.textContent = 'About ' + Math.round(result) + ' KZT per item.';
}

function handleGiftSubmit(event) {
  event.preventDefault();
  clearFieldErrors(form);

  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const occasion = form.querySelector('#occasion');
  const quantity = form.querySelector('#quantity');
  const errors = [];

  if (!isValidRequiredText(name.value)) {
    showFieldError(name, 'Please enter your name.');
    errors.push(name);
  }
  if (!isValidEmail(email.value)) {
    showFieldError(email, 'Please enter a valid email address.');
    errors.push(email);
  }
  if (occasion.value === '') {
    showFieldError(occasion, 'Please choose an occasion.');
    errors.push(occasion);
  }
  // cross-field: на свадьбу минимум 2 штуки
  if (occasion.value === 'wedding' && Number(quantity.value) < 2) {
    showFieldError(quantity, 'For a wedding, please order at least 2 items.');
    errors.push(quantity);
  }

  if (errors.length > 0) {
    errors[0].focus();
    return;
  }

confirmation.textContent =
'Thank you, ' + name.value.trim() +
'! Your gift request has been received. Your reference number is ' +
generateReference() +
'. Our team would be happy to help you find the perfect gift. ';

confirmation.classList.remove('state-hidden');
confirmation.classList.add('state-success');

}

if (form !== null) {
  form.addEventListener('submit', handleGiftSubmit);
  form.querySelector('#budget').addEventListener('input', updateBudgetPerItem);
  form.querySelector('#quantity').addEventListener('input', updateBudgetPerItem);
  renderFeatured();
}
