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

  const $form = $('#contact-form');
  if ($form.length === 0) return;
  $form.attr('novalidate', 'novalidate');

  const $topic = $('#topic');
  const $phone = $('#phone');
  const $email = $('#email');
  const $confirmation = $('#contact-confirmation');

  $topic.empty().append($('<option>', { value: '', text: 'Choose a topic' }));
  $.each(topics, function (index, topic) {
    $('<option>', { value: topic.value, text: topic.label }).appendTo($topic);
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

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    const successText = 'Thank you, ' + name + '. Your details were checked in this browser; no message was sent to the store.';

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
  });

  $form.on('input change', 'input:not(#email), select, textarea', function () {
    AppUtils.clearError($(this));
  });

  $form.on('reset', function () {
    AppUtils.clearErrors($form);
    $confirmation.stop(true, true).addClass('state-hidden').removeClass('contact-success').removeAttr('style').text('');
    setTimeout(function () {
      $hint.text('');
    }, 0);
  });

  $topic.trigger('change');
});
