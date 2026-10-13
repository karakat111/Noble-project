
'use strict';

const topics = [
  { value: 'order', label: 'Order question', requiresPhone: false, estimatedReplyDays: 1 },
  { value: 'visit', label: 'Visit the store', requiresPhone: false, estimatedReplyDays: 2 },
  { value: 'gift', label: 'Gift advice', requiresPhone: false, estimatedReplyDays: 2 },
  { value: 'wholesale', label: 'Wholesale', requiresPhone: true, estimatedReplyDays: 3 },
  { value: 'return', label: 'Return or damage', requiresPhone: true, estimatedReplyDays: 1 },
  { value: 'other', label: 'Other', requiresPhone: false, estimatedReplyDays: 5 }
];

const form = document.querySelector('#contact-form');
const confirmation = document.querySelector('#contact-confirmation');

function getTopicHint(topicValue) {
  const topic = topics.find(function (t) {
    return t.value === topicValue;
  });

  if (!topic) {
    return '';
  }

  return 'Estimated reply: ' + topic.estimatedReplyDays + ' day(s).';
}

function handleContactSubmit(event) {
  event.preventDefault();

  clearFieldErrors(form);

  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const phone = form.querySelector('#phone');
  const topic = form.querySelector('#topic');
  const method = form.querySelector('input[name="contact-method"]:checked');

  const errors = [];

  if (!isValidRequiredText(name.value)) {
    showFieldError(name, 'Please enter your name.');
    errors.push(name);
  }

  if (!isValidEmail(email.value)) {
    showFieldError(email, 'Please enter a valid email address.');
    errors.push(email);
  }

  if (topic.value === '') {
    showFieldError(topic, 'Please choose a topic.');
    errors.push(topic);
  }

  if (method !== null && method.value === 'phone' &&
      !isValidRequiredText(phone.value)) {
    showFieldError(
      phone,
      'Phone is required when you choose to be contacted by phone.'
    );
    errors.push(phone);
  }

  if (errors.length > 0) {
    errors[0].focus();
    return;
  }

  const reference = generateReference();

  confirmation.textContent =
    'Thank you, ' + name.value.trim() +
    '! Your demo reference number is ' + reference;

  confirmation.classList.remove('state-hidden');
  confirmation.classList.add('contact-success');

  form.reset();
}

if (form !== null) {
  form.addEventListener('submit', handleContactSubmit);

  // input event: live email validation
  const emailInput = form.querySelector('#email');

  emailInput.addEventListener('input', function () {
    const old = form.querySelector('[data-error-for="email"]');

    if (old !== null) {
      old.remove();
    }

    emailInput.classList.remove('state-error');

    if (emailInput.value !== '' && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, 'Email format looks incorrect.');
    }
  });

  // change event: topic hint
  const topicSelect = form.querySelector('#topic');
  const hint = document.querySelector('#topic-hint');

  topicSelect.addEventListener('change', function () {
    if (hint !== null) {
      hint.textContent = getTopicHint(topicSelect.value);
    }
  });
}