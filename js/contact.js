
$(function () {
  const topics = [
    {
      value: 'order',
      label: 'Order question',
      requiresPhone: false,
      estimatedReplyDays: 1
    },
    {
      value: 'visit',
      label: 'Visit the store',
      requiresPhone: false,
      estimatedReplyDays: 2
    },
    {
      value: 'gift',
      label: 'Gift advice',
      requiresPhone: false,
      estimatedReplyDays: 2
    },
    {
      value: 'wholesale',
      label: 'Wholesale',
      requiresPhone: true,
      estimatedReplyDays: 3
    },
    {
      value: 'return',
      label: 'Return or damage',
      requiresPhone: true,
      estimatedReplyDays: 1
    },
    {
      value: 'other',
      label: 'Other',
      requiresPhone: false,
      estimatedReplyDays: 5
    }
  ];

  const $form = $('#contact-form');

  if ($form.length === 0) {
    return;
  }

  const $confirmation = $('#contact-confirmation');
  const $hint = $('#topic-hint');
  const $phone = $('#phone');
  const $topic = $('#topic');
  const $email = $('#email');

  function findTopic(value) {
    return topics.find(function (topic) {
      return topic.value === value;
    });
  }

  function getTopicHint(topicValue) {
    const topic = findTopic(topicValue);

    if (!topic) {
      return '';
    }

    let message =
      'Estimated reply: ' + topic.estimatedReplyDays + ' day(s).';

    if (topic.requiresPhone) {
      message += ' Phone number is required.';
    }

    return message;
  }

  $form.on('submit', function (event) {
    event.preventDefault();

    AppUtils.clearErrors($form);

    $form.find(
      'input:not([type="radio"]):not([type="checkbox"]), textarea'
    ).each(function () {
      $(this).val($(this).val().trim());
    });

    const name = $('#name').val();
    const phone = $phone.val();

    const method = $form
      .find('input[name="contact-method"]:checked')
      .val();

    const topic = findTopic($topic.val());

    const phoneRequired =
      method === 'phone' ||
      Boolean(topic && topic.requiresPhone);

    if (!AppUtils.isRequired(name)) {
      AppUtils.showError($('#name'), 'Please enter your name.');
    }

    if (!AppUtils.isEmail($email.val())) {
      AppUtils.showError(
        $email,
        'Please enter a valid email address.'
      );
    }

    if ($topic.val() === '') {
      AppUtils.showError($topic, 'Please choose a topic.');
    }

    if (phoneRequired && !AppUtils.isRequired(phone)) {
      AppUtils.showError(
        $phone,
        'Phone is required for this topic or contact method.'
      );
    } else if (phone !== '' && !AppUtils.isPhone(phone)) {
      AppUtils.showError(
        $phone,
        'Phone format looks incorrect (digits, +, spaces, 10-18 characters).'
      );
    }

    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');
      return;
    }

    $confirmation
      .stop(true, true)
      .text(
        'Thank you, ' + name +
        '! Your demo reference number is ' +
        AppUtils.generateReference()
      )
      .removeClass('state-hidden')
      .addClass('contact-success')
      .hide()
      .fadeIn(400)
      .delay(6000)
      .fadeOut(600, function () {
        $(this)
          .addClass('state-hidden')
          .removeClass('contact-success')
          .removeAttr('style');
      });

    $form.trigger('reset');
    $topic.trigger('change');
  });

  $email.on('input', function () {
    const $this = $(this);

    AppUtils.clearError($this, true);

    if (
      $this.val() !== '' &&
      !AppUtils.isEmail($this.val())
    ) {
      AppUtils.showError(
        $this,
        'Email format looks incorrect.'
      );
    }
  });

  $topic.on('change', function () {
    const topic = findTopic($(this).val());

    $phone.prop(
      'required',
      Boolean(topic && topic.requiresPhone)
    );

    if ($hint.length > 0) {
      $hint.text(getTopicHint($(this).val()));

      if ($hint.text() !== '') {
        $hint.hide().fadeIn(200);
      }
    }
  });

  $form.on(
    'input change',
    'input:not(#email), select, textarea',
    function () {
      AppUtils.clearError($(this));
    }
  );
});
