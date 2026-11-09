
$(function () {
  // Get HTML elements
  const $form = $('#gift-form');
  const $name = $('#name');
  const $email = $('#email');
  const $phone = $('#phone');
  const $occasion = $('#occasion');
  const $quantity = $('#quantity');
  const $budget = $('#budget');
  const $budgetPerItem = $('#budget-per-item');
  const $confirmation = $('#confirmation');
  const $featured = $('#featured-occasion');

  // Stop if the form does not exist
  if ($form.length === 0) {
    return;
  }

  // Our submit handler displays validation errors beside the fields.
  $form.prop('noValidate', true);

  // Gift ideas
  const giftIdeas = {
    wedding: 'Serving pieces, dinner sets or decorative accessories.',
    home: 'A useful tableware piece or a beautiful dinner set.',
    birthday: 'A coffee mug, tea set or decorative vase.',
    nauryz: 'A tea set or elegant table accessories.',
    corporate: 'Matching mugs, serving sets or gift collections.',
    anniversary: 'A porcelain set or elegant decorative pieces.'
  };

  // Show a featured gift idea
  function updateFeaturedIdea() {
    const occasion = $occasion.val();
    const idea = giftIdeas[occasion];

    if (idea) {
      $featured.text(idea);
    } else {
      $featured.text(
        'Choose an occasion to see a gift idea.'
      );
    }
  }

  // Calculate budget per gift
  function updateBudget() {
    const quantity = Number($quantity.val());
    const budget = Number($budget.val());

    if (
      $budget.val() !== '' &&
      quantity > 0 &&
      budget >= 0
    ) {
      const perItem = budget / quantity;

      $budgetPerItem.text(
        'Budget per gift: ' +
        perItem.toLocaleString('en-US') +
        ' ₸'
      );
    } else {
      $budgetPerItem.text('');
    }
  }

  // Show validation error
  function showError($field, message) {
    $field.addClass('is-invalid');

    $('<div>', {
      class: 'gift-error text-danger small mt-1',
      text: message
    }).insertAfter($field);
  }

  // Clear validation errors
  function clearErrors() {
    $form.find('.gift-error').remove();
    $form.find('.is-invalid').removeClass('is-invalid');
  }

  // Generate reference number
  function generateReference() {
    return 'GIFT-' + Math.floor(100000 + Math.random() * 900000);
  }

  // Update featured idea when occasion changes
  $occasion.on('change', updateFeaturedIdea);

  // Update budget when quantity or budget changes
  $quantity.on('input change', updateBudget);
  $budget.on('input change', updateBudget);

  // Form validation and submission
  $form.on('submit', function (event) {
    event.preventDefault();

    clearErrors();

    $confirmation.stop(true, true).addClass('state-hidden').text('');

    // Remove unnecessary spaces
    $form.find('input[type="text"], textarea').each(function () {
      $(this).val($(this).val().trim());
    });

    const name = $name.val();
    const email = $email.val();
    const phone = $phone.val().trim();
    const occasion = $occasion.val();
    const quantity = Number($quantity.val());
    const budget = $budget.val();

    let isValid = true;

    // Validate name
    if (name === '') {
      showError($name, 'Please enter your name.');
      isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showError($email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate phone if phone contact is selected
    const contactMethod =
      $form.find('input[name="contact-method"]:checked').val();

    if (contactMethod === 'phone' && phone === '') {
      showError($phone, 'Please enter your phone number.');
      isValid = false;
    }

    // Validate occasion
    if (occasion === '') {
      showError($occasion, 'Please choose an occasion.');
      isValid = false;
    }

    // Validate quantity
    if (
      $quantity.val() === '' ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      showError(
        $quantity,
        'Please enter a quantity of at least 1.'
      );
      isValid = false;
    }

    // Validate budget
    if (
      budget !== '' &&
      (!Number.isFinite(Number(budget)) || Number(budget) < 0)
    ) {
      showError(
        $budget,
        'Please enter a valid budget.'
      );
      isValid = false;
    }

    // Stop if there are errors
    if (!isValid) {
      $form.find('.is-invalid:first').trigger('focus');
      return;
    }

    // Reset first: the reset handler clears any previous confirmation.
    $form[0].reset();
    updateBudget();
    updateFeaturedIdea();

    // Show success only after reset has finished.
    $confirmation
      .stop(true, true)
      .text(
        'Thank you, ' + name +
        '! Your demo gift enquiry is complete. ' +
        'Reference number: ' + generateReference() + '. Nothing was sent to the store.'
      )
      .removeClass('state-hidden')
      .addClass('contact-success')
      .hide()
      .fadeIn(400);

  });

  // Clear errors when user changes a field
  $form.on('input change', 'input, select, textarea', function () {
    $(this).removeClass('is-invalid');
    $(this).next('.gift-error').remove();
  });

  // Reset button
  $form.on('reset', function () {
    clearErrors();

    $confirmation
      .stop(true, true)
      .addClass('state-hidden')
      .removeClass('contact-success')
      .text('')
      .removeAttr('style');

    // Native reset restores values after this event handler returns.
    setTimeout(function () {
      updateBudget();
      updateFeaturedIdea();
    }, 0);
  });

  // Initial page state
  updateFeaturedIdea();
  updateBudget();
});
