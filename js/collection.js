// jQuery 3.7.1 (full build from CDN): needed for $(), .on(), .slideToggle() etc. Must be loaded before this file.
$(function () {
  const products = [
    { id: 1, name: 'Porcelain Tea Set',     category: 'tea-coffee',    price: 24000, inStock: true,  imageAlt: 'White porcelain tea set' },
    { id: 2, name: 'Ceramic Coffee Mug',    category: 'tea-coffee',    price: 3500,  inStock: true,  imageAlt: 'Ceramic coffee mug' },
    { id: 3, name: 'Dinner Plate Set',      category: 'table-setting', price: 18000, inStock: true,  imageAlt: 'Set of dinner plates' },
    { id: 4, name: 'Linen Table Runner',    category: 'table-setting', price: 6500,  inStock: false, imageAlt: 'Linen table runner' },
    { id: 5, name: 'Glass Decorative Vase', category: 'decorative',    price: 9000,  inStock: true,  imageAlt: 'Glass vase' },
    { id: 6, name: 'Candle Holder Pair',    category: 'decorative',    price: 5200,  inStock: true,  imageAlt: 'Pair of candle holders' }
  ];

  const $list = $('#product-list');

  if ($list.length === 0) {
    return;
  }

  const $search = $('#search');
  const $category = $('#category');
  const $count = $('#result-count');
  const $empty = $('#empty-state');

  // "In stock only" checkbox is created in code (no new hand-written HTML).
  const $stockOnly = $('<input>', { type: 'checkbox', id: 'in-stock-only' });
  $('<label>').text(' In stock only').prepend($stockOnly).insertBefore($list);

  function filterProducts(category, searchText, onlyInStock) {
    const text = searchText.trim().toLowerCase();

    return products.filter(function (p) {
      return (category === 'all' || p.category === category) &&
        p.name.toLowerCase().includes(text) &&
        (!onlyInStock || p.inStock);
    });
  }

  function createCard(item) {
    return $('<article>', { 'class': 'collection-card' }).append(
      $('<h3>', { 'class': 'collection-card-title', text: item.name }),
      $('<p>', { 'class': 'collection-card-price', text: item.price.toLocaleString('en-US') + ' KZT' }),
      $('<p>', {
        'class': 'collection-card-stock ' + (item.inStock ? 'in-stock' : 'out-of-stock'),
        text: item.inStock ? 'In stock' : 'Out of stock'
      }),
      $('<p>', { 'class': 'collection-card-detail', text: item.imageAlt }).hide()
    );
  }

  // FEATURE 3 (list from array + filter + show/hide empty state), rewritten from plain JS.
  // container.textContent = '' -> .empty(); forEach + appendChild -> $.each + .appendTo();
  // createElement/classList.add/textContent per element -> one object with class and text;
  // classList.remove/add on emptyState -> .toggleClass(name, condition).
  // Result: shorter and clearer, especially createCard (about 20 lines became 10).
  function renderCards(array) {
    $list.empty();

    $.each(array, function (index, item) {
      createCard(item).appendTo($list);
    });
  }

  function update() {
    const filtered = filterProducts($category.val(), $search.val(), $stockOnly.prop('checked'));

    renderCards(filtered);
    $count.text('Found: ' + filtered.length);

    if (filtered.length === 0) {
      if ($empty.hasClass('state-hidden')) {
        $empty.removeClass('state-hidden').hide().fadeIn(200);
      }
    } else if (!$empty.hasClass('state-hidden')) {
      $empty.stop(true, true).fadeOut(150, function () {
        // callback: after the fade, return to the class-based hidden state
        $(this).addClass('state-hidden').removeAttr('style');
      });
    }
  }

  // Three different events: input, change, click.
  $search.on('input', update);
  $category.on('change', update);
  // .prop('checked') (not .attr): attr('checked') only shows the ORIGINAL HTML attribute and does not
  // change after the visitor clicks; prop('checked') is the real current true/false state.
  $stockOnly.on('change', update);

  $('#reset').on('click', function () {
    $search.val('');
    $category.val('all');
    $stockOnly.prop('checked', false);
    update();
  });

  // DELEGATED handler: bound to #product-list, which exists on page load.
  // The cards are created by update() every time the filter changes and are destroyed by .empty(),
  // so $('.collection-card').on('click', ...) would only bind to the cards that existed at that
  // moment (none at all yet) and would be lost after the first re-render. A handler bound to the
  // parent survives, and jQuery matches ".collection-card" at the time of each click.
  $list.on('click', '.collection-card', function () {
    const $card = $(this);

    $card.siblings().find('.collection-card-detail').slideUp(150);   // close the other cards
    $card.find('.collection-card-detail').slideToggle(200);           // open or close this one
  });

  update();
});
