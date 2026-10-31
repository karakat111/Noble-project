'use strict';

// OLD PLAIN-JAVASCRIPT VERSIONS of the three features rewritten with jQuery.
// This file is NOT linked to any page. It is kept only for side-by-side comparison.
// Each feature is in its own block { } so the repeated names (form, confirmation...) do not clash.
// The helpers clearFieldErrors, showFieldError, isValidEmail, isValidRequiredText and
// generateReference came from the old shared utils file and are replaced by AppUtils in jquery-utils.js.


// ===== FEATURE 1: contact form validation (new version: contact.js) =====
{
  const topics = [
    { value: 'order', label: 'Order question', requiresPhone: false, estimatedReplyDays: 1 },
    { value: 'visit', label: 'Visit the store', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'gift', label: 'Gift advice', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'wholesale', label: 'Wholesale', requiresPhone: true, estimatedReplyDays: 3 },
    { value: 'return', label: 'Return or damage', requiresPhone: true, estimatedReplyDays: 1 },
    { value: 'other', label: 'Other', requiresPhone: false, estimatedReplyDays: 5 }
  ];

  const form = document.querySelector('#contact-form');
  const confirmation = document.querySelector('#contact-confirmation');

  function getTopicHint(topicValue) {
    const topic = topics.find(function (t) {
      return t.value === topicValue;
    });

    if (!topic) {
      return '';
    }

    return 'Estimated reply: ' + topic.estimatedReplyDays + ' day(s).';
  }

  function handleContactSubmit(event) {
    event.preventDefault();

    clearFieldErrors(form);

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const topic = form.querySelector('#topic');
    const method = form.querySelector('input[name="contact-method"]:checked');

    const errors = [];

    if (!isValidRequiredText(name.value)) {
      showFieldError(name, 'Please enter your name.');
      errors.push(name);
    }

    if (!isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email address.');
      errors.push(email);
    }

    if (topic.value === '') {
      showFieldError(topic, 'Please choose a topic.');
      errors.push(topic);
    }

    if (method !== null && method.value === 'phone' &&
        !isValidRequiredText(phone.value)) {
      showFieldError(
        phone,
        'Phone is required when you choose to be contacted by phone.'
      );
      errors.push(phone);
    }

    if (errors.length > 0) {
      errors[0].focus();
      return;
    }

    const reference = generateReference();

    confirmation.textContent =
      'Thank you, ' + name.value.trim() +
      '! Your demo reference number is ' + reference;

    confirmation.classList.remove('state-hidden');
    confirmation.classList.add('contact-success');

    form.reset();
  }

  if (form !== null) {
    form.addEventListener('submit', handleContactSubmit);

    // input event: live email validation
    const emailInput = form.querySelector('#email');

    emailInput.addEventListener('input', function () {
      const old = form.querySelector('[data-error-for="email"]');

      if (old !== null) {
        old.remove();
      }

      emailInput.classList.remove('state-error');

      if (emailInput.value !== '' && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Email format looks incorrect.');
      }
    });

    // change event: topic hint
    const topicSelect = form.querySelector('#topic');
    const hint = document.querySelector('#topic-hint');

    topicSelect.addEventListener('change', function () {
      if (hint !== null) {
        hint.textContent = getTopicHint(topicSelect.value);
      }
    });
  }
}


// ===== FEATURE 2: gift page, card built in code + confirmation show (new version: gift.js) =====
{
  const occasions = [
    { id: 1, title: 'Wedding',      description: 'Elegant sets for newlyweds.',      priceRangeKZT: '15 000 - 60 000', imageTag: 'wedding' },
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
    // cross-field:
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
}


// ===== FEATURE 3: collection, list from array + filter + empty state (new version: collection.js) =====
{
  const products = [
    { id: 1, name: 'Porcelain Tea Set',     category: 'tea-coffee',    price: 24000, inStock: true,  imageAlt: 'White porcelain tea set' },
    { id: 2, name: 'Ceramic Coffee Mug',    category: 'tea-coffee',    price: 3500,  inStock: true,  imageAlt: 'Ceramic coffee mug' },
    { id: 3, name: 'Dinner Plate Set',      category: 'table-setting', price: 18000, inStock: true,  imageAlt: 'Set of dinner plates' },
    { id: 4, name: 'Linen Table Runner',    category: 'table-setting', price: 6500,  inStock: false, imageAlt: 'Linen table runner' },
    { id: 5, name: 'Glass Decorative Vase', category: 'decorative',    price: 9000,  inStock: true,  imageAlt: 'Glass vase' },
    { id: 6, name: 'Candle Holder Pair',    category: 'decorative',    price: 5200,  inStock: true,  imageAlt: 'Pair of candle holders' }
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
}
