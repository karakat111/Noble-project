
$(function () {


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

    if (
      result === null ||
      !Number.isFinite(budget) ||
      budget <= 0
    ) {
      $perItem.text('');
      return;
    }

    $perItem.html(
      'About <strong>' +
      formatPrice(Math.round(result)) +
      '</strong> per item.'
    );
  }

  $featured.on('click', '[data-action]', function () {
    const $button = $(this);
    const action = $button.data('action');

    if (action === 'shuffle') {
      renderFeatured();
      return;
    }

    if (action === 'choose') {
      const tag = $button.attr('data-tag');
      const $card = $button.closest('.featured-card');
      const $option = $('#occasion option[value="' + tag + '"]');

      if ($option.length > 0) {
        $('#occasion').val(tag).trigger('change');
        $card.find('p').text('Selected in the form below.');
      }
    }
  });

  $('#budget, #quantity').on('input', updateBudgetPerItem);

  $form.on('input change', 'input, select, textarea', function () {
    AppUtils.clearError($(this));
  });

  $form.on('submit', function (event) {
    event.preventDefault();

    AppUtils.clearErrors($form);

    $form.find(
      'input:not([type="radio"]):not([type="checkbox"]), textarea'
    ).each(function () {
      $(this).val($(this).val().trim());
    });

    const $name = $('#name');
    const $email = $('#email');
    const $occasion = $('#occasion');
    const $quantity = $('#quantity');
    const $budget = $('#budget');

    const quantityValue = Number($quantity.val());
    const budgetValue = Number($budget.val());

    if (!AppUtils.isRequired($name.val())) {
      AppUtils.showError($name, 'Please enter your name.');
    }

    if (!AppUtils.isEmail($email.val())) {
      AppUtils.showError($email, 'Please enter a valid email address.');
    }

    if ($occasion.val() === '') {
      AppUtils.showError($occasion, 'Please choose an occasion.');
    }

    const quantityValid =
      AppUtils.isRequired($quantity.val()) &&
      Number.isInteger(quantityValue) &&
      quantityValue >= 1;

    if (!quantityValid) {
      AppUtils.showError(
        $quantity,
        'Please enter a whole number of at least 1.'
      );
    } else if (
      $occasion.val() === 'wedding' &&
      quantityValue < 2
    ) {
      AppUtils.showError(
        $quantity,
        'For a wedding, please order at least 2 items.'
      );
    }

    if (
      $budget.val() !== '' &&
      (
        !Number.isFinite(budgetValue) ||
        budgetValue < 0 ||
        !Number.isInteger(budgetValue)
      )
    ) {
      AppUtils.showError(
        $budget,
        'Please enter a valid whole-number budget.'
      );
    }

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    $confirmation
      .stop(true, true)
      .text(
        'Thank you, ' + $name.val() +
        '! Your gift request has been received. ' +
        'Your reference number is ' +
        AppUtils.generateReference() +
        '. Our team would be happy to help you find the perfect gift.'
      )
      .attr('role', 'status')
      .removeClass('state-hidden')
      .addClass('state-success')
      .hide()
      .fadeIn(300);
  });

  renderFeatured();
});
