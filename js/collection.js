
$(function () {
  const products = [
    {
      id: 1,
      name: 'Porcelain Tea Set',
      category: 'tea-coffee',
      price: 24000,
      inStock: true,
      imageAlt: 'White porcelain tea set'
    },
    {
      id: 2,
      name: 'Ceramic Coffee Mug',
      category: 'tea-coffee',
      price: 3500,
      inStock: true,
      imageAlt: 'Ceramic coffee mug'
    },
    {
      id: 3,
      name: 'Dinner Plate Set',
      category: 'table-setting',
      price: 18000,
      inStock: true,
      imageAlt: 'Set of dinner plates'
    },
    {
      id: 4,
      name: 'Linen Table Runner',
      category: 'table-setting',
      price: 6500,
      inStock: false,
      imageAlt: 'Linen table runner'
    },
    {
      id: 5,
      name: 'Glass Decorative Vase',
      category: 'decorative',
      price: 9000,
      inStock: true,
      imageAlt: 'Glass vase'
    },
    {
      id: 6,
      name: 'Candle Holder Pair',
      category: 'decorative',
      price: 5200,
      inStock: true,
      imageAlt: 'Pair of candle holders'
    }
  ];

  const $list = $('#product-list');

  if ($list.length === 0) {
    return;
  }

  const $search = $('#search');
  const $category = $('#category');
  const $count = $('#result-count');
  const $empty = $('#empty-state');

  function formatPrice(amount) {
    return amount.toLocaleString('en-US') + ' ₸';
  }

  const $stockOnly = $('<input>', {
    type: 'checkbox',
    id: 'in-stock-only'
  });

  $('<label>')
    .text(' In stock only')
    .prepend($stockOnly)
    .insertBefore($list);

  function filterProducts(category, searchText, onlyInStock) {
    const text = searchText.trim().toLowerCase();

    return products.filter(function (product) {
      return (
        (category === 'all' || product.category === category) &&
        product.name.toLowerCase().includes(text) &&
        (!onlyInStock || product.inStock)
      );
    });
  }

  function createCard(item) {
    return $('<article>', {
      'class': 'collection-card'
    }).append(
      $('<h3>', {
        'class': 'collection-card-title',
        text: item.name
      }),
      $('<p>', {
        'class': 'collection-card-price',
        text: formatPrice(item.price)
      }),
      $('<p>', {
        'class': 'collection-card-stock ' +
          (item.inStock ? 'in-stock' : 'out-of-stock'),
        text: item.inStock ? 'In stock' : 'Out of stock'
      }),
      $('<p>', {
        'class': 'collection-card-detail',
        text: item.imageAlt
      }).hide()
    );
  }

  function renderCards(array) {
    $list.empty();

    $.each(array, function (index, item) {
      createCard(item).appendTo($list);
    });
  }

  function update() {
    const filtered = filterProducts(
      $category.val(),
      $search.val(),
      $stockOnly.prop('checked')
    );

    renderCards(filtered);

    $count.text('Found: ' + filtered.length);

    if (filtered.length === 0) {
      if ($empty.hasClass('state-hidden')) {
        $empty.removeClass('state-hidden').hide().fadeIn(200);
      }
    } else if (!$empty.hasClass('state-hidden')) {
      $empty.stop(true, true).fadeOut(150, function () {
        $(this)
          .addClass('state-hidden')
          .removeAttr('style');
      });
    }
  }

  $search.on('input', update);
  $category.on('change', update);
  $stockOnly.on('change', update);

  $('#reset').on('click', function () {
    $search.val('');
    $category.val('all');
    $stockOnly.prop('checked', false);

    update();
  });

  $list.on('click', '.collection-card', function () {
    const $card = $(this);

    $card.siblings()
      .find('.collection-card-detail')
      .slideUp(150);

    $card.find('.collection-card-detail')
      .slideToggle(200);
  });

  update();
});
