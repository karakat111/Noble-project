$(function () {
  const occasions = [
    { id: 1, title: 'Wedding', description: 'Elegant sets for newlyweds.', priceRangeKZT: '15 000 - 60 000', imageTag: 'wedding' },
    { id: 2, title: 'Housewarming', description: 'Practical pieces for a new home.', priceRangeKZT: '8 000 - 30 000', imageTag: 'home' },
    { id: 3, title: 'Birthday', description: 'Small personal gifts.', priceRangeKZT: '5 000 - 20 000', imageTag: 'birthday' },
    { id: 4, title: 'Nauryz', description: 'Festive table settings.', priceRangeKZT: '10 000 - 40 000', imageTag: 'nauryz' },
    { id: 5, title: 'Corporate', description: 'Branded tea and coffee sets.', priceRangeKZT: '7 000 - 35 000', imageTag: 'corporate' },
    { id: 6, title: 'Anniversary', description: 'Pairs and matching sets.', priceRangeKZT: '12 000 - 50 000', imageTag: 'anniversary' }
  ];

  const $form = $('#gift-form');
  if ($form.length === 0) return;

  const $occasion = $('#occasion');
  const $confirmation = $('#confirmation');
  const $featured = $('#featured-occasion');
  const $perItem = $('#budget-per-item');
  const $preview = $('#gift-preview');
  let currentIndex = -1;

  // Rebuild occasion options
  $occasion.find('option').filter(function () {
    return $(this).val() !== '';
  }).remove();

  $.each(occasions, function (index, item) {
    $('<option>', {
      value: item.imageTag,
      text: item.title
    }).appendTo($occasion);
  });

  function calculateBudgetPerItem(budget, quantity) {
    if (quantity <= 0) return null;
    return budget / quantity;
  }

  function createOccasionCard(item) {
    return $('<div>', { 'class': 'featured-card' }).append(
      $('<h3>').text(item.title),
      $('<p>').text(item.description + ' (' + item.priceRangeKZT + ' KZT)'),
      $('<button>', {
        type: 'button',
        text: 'Choose this occasion',
        'data-action': 'choose',
        'data-tag': item.imageTag,
        'class': 'btn btn-outline-primary me-2'
      }),
      $('<button>', {
        type: 'button',
        text: 'Another idea',
        'data-action': 'shuffle',
        'class': 'btn btn-outline-secondary'
      })
    );
  }

  function renderFeatured() {
    let index = Math.floor(Math.random() * occasions.length);

    if (index === currentIndex) {
      index = (index + 1) % occasions.length;
    }

    currentIndex = index;

    createOccasionCard(occasions[index])
      .hide()
      .appendTo($featured.empty())
      .fadeIn(250);
  }

  function updateBudgetPerItem() {
    const budget = Number($('#budget').val());
    const quantity = Number($('#quantity').val());
    const result = calculateBudgetPerItem(budget, quantity);

    if (result === null || budget <= 0) {
      $perItem.text('');
      return;
    }

    $perItem.text(
      'About ' + Math.round(result).toLocaleString('en-US') + ' KZT per item.'
    );
  }

  // Preview button
  function showPreview() {
    const selected = occasions.find(function (item) {
      return item.imageTag === $occasion.val();
    });

    const quantity = Number($('#quantity').val());
    const budget = Number($('#budget').val());
    const perItem = calculateBudgetPerItem(budget, quantity);

    const summary = [
      'Gift request preview',
      'Occasion: ' + (selected ? selected.title : 'Not selected'),
      'Number of gifts: ' + (quantity > 0 ? quantity : 'Not entered'),
      'Budget per item: ' + (
        perItem !== null && budget > 0
          ? Math.round(perItem).toLocaleString('en-US') + ' KZT'
          : 'Not available'
      )
    ].join(' | ');

    $confirmation.stop(true, true)
      .text(summary)
      .attr('role', 'status')
      .removeClass('state-hidden state-success')
      .hide()
      .fadeIn(250);
  }

  $featured.on('click', '[data-action]', function () {
    const $button = $(this);

    if ($button.data('action') === 'shuffle') {
      renderFeatured();
      return;
    }

    const tag = $button.attr('data-tag');
    const $card = $button.closest('.featured-card');

    if ($occasion.find('option').filter(function () {
      return $(this).val() === tag;
    }).length) {
      $occasion.val(tag).trigger('change');
      $card.find('p').text('Selected in the form below.');
    }
  });

  $('#budget, #quantity').on('input', updateBudgetPerItem);

  $preview.prop('disabled', false).on('click', showPreview);

  $form.on('input change', 'input, select, textarea', function () {
    AppUtils.clearError($(this));
  });

  // Form validation
  $form.on('submit', function (event) {
    event.preventDefault();
    AppUtils.clearErrors($form);

    $form.find('input:not([type="radio"]):not([type="checkbox"]), textarea').each(function () {
      $(this).val($(this).val().trim());
    });

    const $name = $('#name');
    const $email = $('#email');
    const $phone = $('#phone');
    const $quantity = $('#quantity');

    const method = $form.find('input[name="contact-method"]:checked').val();
    const phone = $phone.val();

    if (!AppUtils.isRequired($name.val())) {
      AppUtils.showError($name, 'Please enter your name.');
    }

    if (!AppUtils.isEmail($email.val())) {
      AppUtils.showError($email, 'Please enter a valid email address.');
    }

    if (!AppUtils.isRequired($occasion.val())) {
      AppUtils.showError($occasion, 'Please choose an occasion.');
    }

    if (method === 'phone' && !AppUtils.isRequired(phone)) {
      AppUtils.showError($phone, 'Please enter your phone number.');
    } else if (phone !== '' && !AppUtils.isPhone(phone)) {
      AppUtils.showError($phone, 'Please enter a valid phone number.');
    }

    if ($occasion.val() === 'wedding' && Number($quantity.val()) < 2) {
      AppUtils.showError($quantity, 'For a wedding, please order at least 2 items.');
    }

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    $confirmation.stop(true, true)
      .text(
        'Thank you, ' + $name.val() +
        '! Your gift request has been received. Reference number: ' +
        AppUtils.generateReference() + '.'
      )
      .attr('role', 'status')
      .removeClass('state-hidden')
      .addClass('state-success')
      .hide()
      .fadeIn(300)
      .delay(6000)
      .fadeOut(600, function () {
        $(this)
          .addClass('state-hidden')
          .removeClass('state-success')
          .removeAttr('style');
      });
  });

  renderFeatured();
});