
$(function () {
  const occasions = [
    {
      id: 1,
      title: 'Wedding',
      description: 'Elegant sets for newlyweds.',
      priceRangeKZT: [15000, 60000],
      imageTag: 'wedding'
    },
    {
      id: 2,
      title: 'Housewarming',
      description: 'Practical pieces for a new home.',
      priceRangeKZT: [8000, 30000],
      imageTag: 'housewarming'
    },
    {
      id: 3,
      title: 'Birthday',
      description: 'Small personal gifts.',
      priceRangeKZT: [5000, 20000],
      imageTag: 'birthday'
    },
    {
      id: 4,
      title: 'Nauryz',
      description: 'Festive table settings.',
      priceRangeKZT: [10000, 40000],
      imageTag: 'other'
    },
    {
      id: 5,
      title: 'Corporate',
      description: 'Branded tea and coffee sets.',
      priceRangeKZT: [7000, 35000],
      imageTag: 'other'
    },
    {
      id: 6,
      title: 'Anniversary',
      description: 'Pairs and matching sets.',
      priceRangeKZT: [12000, 50000],
      imageTag: 'other'
    }
  ];

  const $form = $('#gift-form');

  if ($form.length === 0) {
    return;
  }

  const $confirmation = $('#confirmation');
  const $featured = $('#featured-occasion');
  const $perItem = $('#budget-per-item');

  let currentIndex = -1;

  function formatPrice(amount) {
    return amount.toLocaleString('en-US') + ' ₸';
  }

  function calculateBudgetPerItem(budget, quantity) {
    if (quantity <= 0) {
      return null;
    }

    return budget / quantity;
  }

  function scaleBox($el, from, to) {
    $({ s: from }).animate(
      { s: to },
      {
        duration: 300,
        step: function (now) {
          $el.css('transform', 'scale(' + now + ')');
        }
      }
    );
  }

  $('.alert')
    .on('mouseenter', function () {
      scaleBox($(this), 1, 1.03);
    })
    .on('mouseleave', function () {
      scaleBox($(this), 1.03, 1);
    });

  function createOccasionCard(item) {
    const priceText =
      formatPrice(item.priceRangeKZT[0]) +
      ' - ' +
      formatPrice(item.priceRangeKZT[1]);

    return $('<div>', { 'class': 'featured-card' }).append(
      $('<h3>').text(item.title),
      $('<p>').text(item.description + ' (' + priceText + ')'),
      $('<button>', {
        type: 'button',
        text: 'Choose this occasion',
        'data-action': 'choose',
        'data-tag': item.imageTag
      }),
      $('<button>', {
        type: 'button',
        text: 'Another idea',
        'data-action': 'shuffle'
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
