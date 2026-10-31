// jQuery 3.7.1 (full build from CDN): needed for $(), .on(), .fadeIn() etc. Must be loaded before this file.
$(function () {
  const occasions = [
    { id: 1, title: 'Wedding',      description: 'Elegant sets for newlyweds.',      priceRangeKZT: '15 000 - 60 000', imageTag: 'wedding' },
    { id: 2, title: 'Housewarming', description: 'Practical pieces for a new home.', priceRangeKZT: '8 000 - 30 000',  imageTag: 'home' },
    { id: 3, title: 'Birthday',     description: 'Small personal gifts.',            priceRangeKZT: '5 000 - 20 000',  imageTag: 'birthday' },
    { id: 4, title: 'Nauryz',       description: 'Festive table settings.',          priceRangeKZT: '10 000 - 40 000', imageTag: 'nauryz' },
    { id: 5, title: 'Corporate',    description: 'Branded tea and coffee sets.',     priceRangeKZT: '7 000 - 35 000',  imageTag: 'corporate' },
    { id: 6, title: 'Anniversary',  description: 'Pairs and matching sets.',         priceRangeKZT: '12 000 - 50 000', imageTag: 'anniversary' }
  ];

  const $form = $('#gift-form');

  if ($form.length === 0) {
    return;
  }

  const $confirmation = $('#confirmation');
  const $featured = $('#featured-occasion');
  const $perItem = $('#budget-per-item');
  let currentIndex = -1;

  function calculateBudgetPerItem(budget, quantity) {
    if (quantity === 0) {
      return null;
    }
    return budget / quantity;
  }

  // FEATURE 2 (card built in code + show/hide), rewritten from plain JS.
  // createElement x3 + appendChild x3 + textContent -> one nested $('<tag>') ... .append(...);
  // featured.textContent = '' -> .empty(); appendChild -> .appendTo() + .fadeIn().
  // Result: noticeably shorter and the structure of the card is visible in the code itself.
  function createOccasionCard(item) {
    return $('<div>', { 'class': 'featured-card' }).append(
      $('<h3>').text(item.title),
      $('<p>').text(item.description + ' (' + item.priceRangeKZT + ' KZT)'),
      $('<button>', { type: 'button', text: 'Choose this occasion', 'data-action': 'choose', 'data-tag': item.imageTag }),
      $('<button>', { type: 'button', text: 'Another idea', 'data-action': 'shuffle' })
    );
  }

  function renderFeatured() {
    let index = Math.floor(Math.random() * occasions.length);

    if (index === currentIndex) {
      index = (index + 1) % occasions.length;   // never show the same idea twice in a row
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

    // .html() is fine here: the markup is ours and the only inserted value is a number we calculated.
    $perItem.html('About <strong>' + Math.round(result) + '</strong> KZT per item.');
  }

  // DELEGATED handler: bound to #featured-occasion, which exists from the start.
  // The buttons are created by our own code (and thrown away on every renderFeatured()),
  // so at the moment of binding they do not exist yet - $('[data-action]').on(...) would
  // find nothing. With delegation the click is caught on the parent while it bubbles up,
  // and jQuery checks the selector at the moment of the click, so even new buttons work.
  $featured.on('click', '[data-action]', function () {
    const $button = $(this);
    const action = $button.data('action');

    if (action === 'shuffle') {
      renderFeatured();
      return;
    }

    if (action === 'choose') {
      const tag = $button.attr('data-tag');
      const $card = $button.closest('.featured-card');   // from the button to its card
      const $option = $('#occasion option[value="' + tag + '"]');   // selector by attribute

      if ($option.length > 0) {
        $('#occasion').val(tag).trigger('change');
        $card.find('p').text('Selected in the form below.');
      }
    }
  });

  // input events: live budget per item
  $('#budget, #quantity').on('input', updateBudgetPerItem);

  // Clear an error as soon as the visitor fixes the field.
  $form.on('input change', 'input, select, textarea', function () {
    AppUtils.clearError($(this));
  });

  $form.on('submit', function (event) {
    event.preventDefault();   // otherwise the page reloads and validation/message are lost

    AppUtils.clearErrors($form);

    $form.find('input:not([type="radio"]):not([type="checkbox"]), textarea').each(function () {
      $(this).val($(this).val().trim());
    });

    const $name = $('#name');
    const $email = $('#email');
    const $occasion = $('#occasion');
    const $quantity = $('#quantity');

    if (!AppUtils.isRequired($name.val())) {
      AppUtils.showError($name, 'Please enter your name.');
    }

    if (!AppUtils.isEmail($email.val())) {
      AppUtils.showError($email, 'Please enter a valid email address.');
    }

    if ($occasion.val() === '') {
      AppUtils.showError($occasion, 'Please choose an occasion.');
    }

    // cross-field check
    if ($occasion.val() === 'wedding' && Number($quantity.val()) < 2) {
      AppUtils.showError($quantity, 'For a wedding, please order at least 2 items.');
    }

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    // .text(): the name comes from the visitor. .attr(): role is an HTML attribute for screen readers.
    $confirmation
      .stop(true, true)
      .text('Thank you, ' + $name.val() + '! Your gift request has been received. ' +
        'Your reference number is ' + AppUtils.generateReference() +
        '. Our team would be happy to help you find the perfect gift.')
      .attr('role', 'status')
      .removeClass('state-hidden')
      .addClass('state-success')
      .hide()
      .fadeIn(300);
  });

  renderFeatured();
});
