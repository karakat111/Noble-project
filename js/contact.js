// jQuery 3.7.1 and jquery-utils.js must be loaded before this file.
$(function () {
  const topics = [
    { value: 'order', label: 'Order question', requiresPhone: false, estimatedReplyDays: 1 },
    { value: 'visit', label: 'Visit the store', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'gift', label: 'Gift advice', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'wholesale', label: 'Wholesale', requiresPhone: true, estimatedReplyDays: 3 },
    { value: 'return', label: 'Return or damage', requiresPhone: true, estimatedReplyDays: 1 },
    { value: 'other', label: 'Other', requiresPhone: false, estimatedReplyDays: 5 }
  ];

  const occasions = [
    { id: 1, title: 'Wedding', description: 'Mug, saucer, teapot, bowl, pitcher, decanter and serving dishes.', priceRangeKZT: '58 000 - 220 000', imageTag: 'wedding' },
    { id: 2, title: 'Housewarming', description: 'Mug, teapot, bowl and pitcher for a new home.', priceRangeKZT: '80 000 - 144 000', imageTag: 'home' },
    { id: 3, title: 'Birthday', description: 'Mug, bowl, candle holder or jewelry box.', priceRangeKZT: '38 000 - 120 000', imageTag: 'birthday' },
    { id: 4, title: 'Nauryz', description: 'Teapot, bowl, pitcher, saucer and caviar serving pieces.', priceRangeKZT: '58 000 - 220 000', imageTag: 'nauryz' },
    { id: 5, title: 'Corporate', description: 'Mug, teapot and saucer for tea and coffee.', priceRangeKZT: '58 000 - 144 000', imageTag: 'corporate' },
    { id: 6, title: 'Anniversary', description: 'Jewelry box, candle holder, decanter or caviar cup.', priceRangeKZT: '38 000 - 220 000', imageTag: 'anniversary' }
  ];

  const $form = $('#contact-form');
  if ($form.length === 0) return;
  $form.attr('novalidate', 'novalidate');

  const $topic = $('#topic');
  const $phone = $('#phone');
  const $email = $('#email');
  const $confirmation = $('#contact-confirmation');
  const $giftFields = $('#gift-fields');
  const $occasion = $('#occasion');
  const $quantity = $('#quantity');
  const $budget = $('#budget');
  const $perItem = $('#budget-per-item');

  $topic.empty().append($('<option>', { value: '', text: 'Choose a topic' }));
  $.each(topics, function (index, topic) {
    $('<option>', { value: topic.value, text: topic.label }).appendTo($topic);
  });

  $occasion.empty().append($('<option>', { value: '', text: 'Choose an occasion' }));
  $.each(occasions, function (index, item) {
    $('<option>', { value: item.imageTag, text: item.title }).appendTo($occasion);
  });

  const $hint = $('#topic-hint');

  function findTopic(value) {
    return topics.find(function (topic) {
      return topic.value === value;
    });
  }

  function getTopicHint(value) {
    const topic = findTopic(value);
    return topic ? 'Estimated reply: ' + topic.estimatedReplyDays + ' day(s).' : '';
  }

  function isGiftTopic() {
    return $topic.val() === 'gift';
  }

  function toggleGiftFields() {
    if (isGiftTopic()) {
      $giftFields.removeClass('state-hidden').hide().slideDown(200);
      $occasion.prop('required', true);
      $quantity.prop('required', true);
    } else {
      $giftFields.slideUp(150, function () {
        $(this).addClass('state-hidden');
      });
      $occasion.prop('required', false).val('');
      $quantity.prop('required', false).val('');
      $budget.val('');
      $perItem.text('');
      $('#packaging').prop('checked', false);
      $('#occasion-date').val('');
    }
  }

  function calculateBudgetPerItem(budget, quantity) {
    if (quantity <= 0 || !budget || budget <= 0) return null;
    return budget / quantity;
  }

  function updateBudgetPerItem() {
    const budget = Number($budget.val());
    const quantity = Number($quantity.val());
    const result = calculateBudgetPerItem(budget, quantity);
    if (result === null) {
      $perItem.text('');
      return;
    }
    $perItem.text('About ' + Math.round(result).toLocaleString('ru-RU') + ' KZT per item.');
  }

  $budget.on('input', updateBudgetPerItem);
  $quantity.on('input', updateBudgetPerItem);

  $form.on('submit', function (event) {
    event.preventDefault();
    AppUtils.clearErrors($form);

    $form.find('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea').each(function () {
      $(this).val($(this).val().trim());
    });

    const name = $('#name').val();
    const phone = $phone.val();
    const method = $form.find('input[name="contact-method"]:checked').val();
    const topic = findTopic($topic.val());
    const phoneRequired = method === 'phone' || Boolean(topic && topic.requiresPhone);

    if (!AppUtils.isRequired(name)) {
      AppUtils.showError($('#name'), 'Please enter your name.');
    }
    if (!AppUtils.isEmail($email.val())) {
      AppUtils.showError($email, 'Please enter a valid email address.');
    }
    if ($topic.val() === '') {
      AppUtils.showError($topic, 'Please choose a topic.');
    }
    if (phoneRequired && !AppUtils.isRequired(phone)) {
      AppUtils.showError($phone, 'Phone is required for this topic or contact method.');
    } else if (phone !== '' && !AppUtils.isPhone(phone)) {
      AppUtils.showError($phone, 'Phone format looks incorrect (10-18 characters).');
    }

    if (isGiftTopic()) {
      if (!AppUtils.isRequired($occasion.val())) {
        AppUtils.showError($occasion, 'Please choose an occasion.');
      }
      const qty = Number($quantity.val());
      if (!AppUtils.isRequired($quantity.val()) || qty < 1 || !Number.isInteger(qty)) {
        AppUtils.showError($quantity, 'Please enter a whole number of at least 1.');
      }
      if ($occasion.val() === 'wedding' && qty >= 1 && qty < 2) {
        AppUtils.showError($quantity, 'For a wedding, please order at least 2 items.');
      }
    }

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    let successText = 'Thank you, ' + name + '! Your demo reference number is ' + AppUtils.generateReference() + '.';
    if (isGiftTopic()) {
      const selected = occasions.find(function (item) {
        return item.imageTag === $occasion.val();
      });
      const occasionTitle = selected ? selected.title : 'Gift';
      successText = 'Thank you, ' + name + '! Your gift enquiry (' + occasionTitle + ') has been received. Reference: ' + AppUtils.generateReference() + '.';
    }

    $confirmation.stop(true, true)
      .text(successText)
      .removeClass('state-hidden')
      .addClass('contact-success')
      .hide()
      .fadeIn(400)
      .delay(6000)
      .fadeOut(600, function () {
        $(this).addClass('state-hidden').removeClass('contact-success').removeAttr('style');
      });
  });

  $email.on('input', function () {
    const $this = $(this);
    AppUtils.clearError($this, true);
    if ($this.val() !== '' && !AppUtils.isEmail($this.val())) {
      AppUtils.showError($this, 'Email format looks incorrect.');
    }
  });

  $topic.on('change', function () {
    const topic = findTopic($(this).val());
    $phone.prop('required', Boolean(topic && topic.requiresPhone));
    $hint.text(getTopicHint($(this).val()));
    if ($hint.text() !== '') $hint.hide().fadeIn(200);
    toggleGiftFields();
  });

  $form.on('input change', 'input:not(#email), select, textarea', function () {
    AppUtils.clearError($(this));
  });

  $form.on('reset', function () {
    setTimeout(function () {
      $hint.text('');
      $perItem.text('');
      toggleGiftFields();
    }, 0);
  });

  $topic.trigger('change');
});