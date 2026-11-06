'use strict';

// Shared helpers for all pages (jQuery version).
// Load AFTER jQuery and BEFORE the page file.

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

  // Display an error message next to the field.
  showError: function ($field, message) {
    $field.addClass('state-error');

    $('<span>', {
      'class': 'field-error text-danger small d-block',
      'data-error-for': $field.attr('id'),
      text: message
    }).insertAfter($field);
  },

  // Clear one field's error.
  clearError: function ($field, instant) {
    const $message = $field.parent().children(
      '[data-error-for="' + $field.attr('id') + '"]'
    );

    $field.removeClass('state-error');

    if (instant) {
      $message.remove();
    } else {
      $message.stop(true, true).fadeOut(150, function () {
        $(this).remove();
      });
    }
  },

  // Clear all errors in a form.
  clearErrors: function ($form) {
    $form.find('.state-error').removeClass('state-error');
    $form.find('[data-error-for]').remove();
  }
};