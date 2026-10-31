// jQuery 3.7.1 (full build from CDN): needed for $(), .on(), .fadeIn() etc. Must be loaded before this file.
$(function () {
  const topics = [
    { value: 'order', label: 'Order question', requiresPhone: false, estimatedReplyDays: 1 },
    { value: 'visit', label: 'Visit the store', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'gift', label: 'Gift advice', requiresPhone: false, estimatedReplyDays: 2 },
    { value: 'wholesale', label: 'Wholesale', requiresPhone: true, estimatedReplyDays: 3 },
    { value: 'return', label: 'Return or damage', requiresPhone: true, estimatedReplyDays: 1 },
    { value: 'other', label: 'Other', requiresPhone: false, estimatedReplyDays: 5 }
  ];

  const $form = $('#contact-form');          // selector by id

  if ($form.length === 0) {
    return;
  }

  const $confirmation = $('#contact-confirmation');
  const $hint = $('#topic-hint');
  const $phone = $('#phone');
  const $topic = $('#topic');
  const $email = $('#email');

  function findTopic(value) {
    return topics.find(function (t) {
      return t.value === value;
    });
  }

  function getTopicHint(topicValue) {
    const topic = findTopic(topicValue);

    if (!topic) {
      return '';
    }

    return 'Estimated reply: ' + topic.estimatedReplyDays + ' day(s).';
  }

  // FEATURE 1 (form validation), rewritten from plain JS.
  // querySelector x6 -> $('#id'); manual errors[] + remove() + classList -> .addClass() and .find('.state-error');
  // form.reset() -> .trigger('reset'); classList.remove/add -> .removeClass/.addClass.
  // Result: the DOM parts are clearly shorter and easier to read, but the checks themselves
  // (if/else with regex) are the same length - jQuery does not make the logic shorter.
  $form.on('submit', function (event) {
    // Without preventDefault the browser would send the form and reload the page,
    // so the visitor would never see our error messages or the success message.
    event.preventDefault();

    AppUtils.clearErrors($form);

    // trim every text-like field first (selector with :not() filters out radios and checkboxes)
    $form.find('input:not([type="radio"]):not([type="checkbox"]), textarea').each(function () {
      $(this).val($(this).val().trim());
    });

    const name = $('#name').val();
    const phone = $phone.val();
    const method = $form.find('input[name="contact-method"]:checked').val();  // :checked filter
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
      AppUtils.showError($phone, 'Phone format looks incorrect (digits, +, spaces, 10-18 characters).');
    }

    // Browser attributes (required, type="email") are only the first line of defence:
    // the visitor can disable JavaScript or edit the HTML in DevTools, so the server must always
    // check the data again. A browser check never replaces a server check.
    if ($form.find('.state-error').length > 0) {
      $form.find('.state-error:first').trigger('focus');   // :first filter
      return;
    }

    // Success only when every check passed.
    // .text() (not .html()): the name is typed by the visitor, .html() would run any tags in it.
    // Chain, link by link: stop(true,true) finishes old animations -> text() puts the message ->
    // removeClass() un-hides the block -> addClass() applies the success style -> hide() prepares
    // the fade -> fadeIn(400) shows it -> delay(6000) waits -> fadeOut(600, callback) hides it again.
    $confirmation
      .stop(true, true)
      .text('Thank you, ' + name + '! Your demo reference number is ' + AppUtils.generateReference())
      .removeClass('state-hidden')
      .addClass('contact-success')
      .hide()
      .fadeIn(400)
      .delay(6000)
      .fadeOut(600, function () {
        // callback: runs only after the fade-out has finished
        $(this).addClass('state-hidden').removeClass('contact-success').removeAttr('style');
      });

    $form.trigger('reset');
    $topic.trigger('change');   // refresh the hint and the phone "required" flag after the reset
  });

  // input event: live e-mail validation
  $email.on('input', function () {
    const $this = $(this);

    AppUtils.clearError($this, true);

    if ($this.val() !== '' && !AppUtils.isEmail($this.val())) {
      AppUtils.showError($this, 'Email format looks incorrect.');
    }
  });

  // change event: topic hint + phone becomes required for some topics
  // .prop() (not .attr()): "required" is a live state of the element, .prop gives true/false.
  $topic.on('change', function () {
    const topic = findTopic($(this).val());

    $phone.prop('required', Boolean(topic && topic.requiresPhone));

    if ($hint.length > 0) {
      $hint.text(getTopicHint($(this).val()));
      if ($hint.text() !== '') {
        $hint.hide().fadeIn(200);   // effect with a purpose: draws attention to the new hint
      }
    }
  });

  // Clear an error as soon as the visitor fixes the field (e-mail has its own live handler above).
  $form.on('input change', 'input:not(#email), select, textarea', function () {
    AppUtils.clearError($(this));
  });
});
