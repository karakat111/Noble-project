'use strict';

// Shared helpers for all pages (jQuery version). Load AFTER jQuery and BEFORE the page file.
// jQuery 3.7.1, full build (not "slim"): slim has no effects (fadeIn, slideToggle...), and we use them.

const AppUtils = {
  isRequired: function (value) {
    return String(value).trim() !== '';
  },

  isEmail: function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
  },

  isPhone: function (value) {
    return /^\+?[0-9\s()-]{10,18}$/.test(String(value).trim());
  },

  generateReference: function () {
    return 'REF-' + Date.now().toString(36).toUpperCase() +
      Math.floor(Math.random() * 90 + 10);
  },

  // Message is created in code and placed right next to the field (not one message for the whole form).
  showError: function ($field, message) {
    $field.addClass('state-error');
    $('<span>', {
      'class': 'field-error',
      'data-error-for': $field.attr('id'),
      text: message
    }).insertAfter($field);
  },

  // Clear one field. instant = true removes at once (needed when we show a new error right after).
  clearError: function ($field, instant) {
    const $message = $field.parent().children('[data-error-for="' + $field.attr('id') + '"]');

    $field.removeClass('state-error');

    if (instant) {
      $message.remove();
    } else {
      // callback: remove the element only AFTER the fade finished
      $message.stop(true, true).fadeOut(150, function () {
        $(this).remove();
      });
    }
  },

  clearErrors: function ($form) {
    $form.find('.state-error').removeClass('state-error');
    $form.find('[data-error-for]').remove();
  }
};
