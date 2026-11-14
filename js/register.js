// jQuery 3.7.1 full build includes effects. Ready waits for the registration HTML.
$(function () {
    // Rewrite 3: $(), .val(), .on() and class methods replace DOM selectors,
    // value properties and listeners. Field-by-field feedback needs more code than
    // the old native bubbles, but the same jQuery methods are used throughout.
    const form = $('#register-form');
    const password = $('#register-password');
    const confirmation = $('#register-confirm');
    const success = $('#register-success');
    const status = $('#register-status');
    const strength = $('<p class="small mt-2 mb-0" role="status"></p>');
    $('#register-password-help').after(strength);

    // One set of rules is used both while typing and when submitting.
    function missingPasswordRules(value) {
        const missing = [];
        if (value.length < 8) missing.push('at least 8 characters');
        if (!/[A-Z]/.test(value)) missing.push('an uppercase letter (A–Z)');
        if (!/[a-z]/.test(value)) missing.push('a lowercase letter (a–z)');
        if (!/[0-9]/.test(value)) missing.push('a number (0–9)');
        return missing;
    }

    function showPasswordAdvice() {
        const value = password.val();
        const missing = missingPasswordRules(value);
        if (value === '') {
            strength.text('');
        } else if (missing.length > 0) {
            strength.text('Still needed: ' + missing.join(', ') + '.');
        } else {
            strength.text('All password requirements met. Use a unique password.');
        }
    }

    const fields = form.find('input');
    fields.each(function () {
        const field = $(this);
        const id = field.attr('id') + '-error';
        let anchor = field;
        if (field.parent().hasClass('password-field')) {
            anchor = field.parent();
        }
        $('<p class="field-error state-error state-hidden small mt-2"></p>').attr('id', id).appendTo(anchor.parent());
        field.attr('aria-describedby', id + (field.attr('id') === 'register-password' ? ' register-password-help' : ''));
    });
    // Keep required/type/minlength attributes as baseline constraints. Disable only
    // browser popups so submit can report every field error next to its field.
    form.prop('noValidate', true);

    function validateField(field) {
        const id = field.attr('id');
        const isPassword = id === 'register-password' || id === 'register-confirm';
        const value = isPassword ? field.val() : field.val().trim();
        if (value === '') return 'This field is required.';
        if (value.length > Number(field.attr('maxlength'))) return 'This value is too long.';
        if (id === 'register-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Enter a valid email address.';
        }
        if (id === 'register-phone') {
            if (!/^\+[0-9]{7,15}$/.test(value)) {
                return 'Use + followed by 7–15 digits, for example +77001234567.';
            }
        }
        if (id === 'register-password') {
            const missing = missingPasswordRules(value);
            if (missing.length > 0) return 'Include ' + missing.join(', ') + '.';
        }
        if (id === 'register-confirm' && value !== password.val()) {
            return 'Passwords must match.';
        }
        return '';
    }

    function showError(field) {
        const text = validateField(field);
        let anchor = field;
        if (field.parent().hasClass('password-field')) {
            anchor = field.parent();
        }
        anchor.siblings('.field-error').text(text).toggleClass('state-hidden', text === '');
        field.toggleClass('is-invalid', text !== '');
        field.attr('aria-invalid', text !== '' ? 'true' : 'false');
        return text === '';
    }

    function handleEdit() {
        success.stop(true, true).addClass('state-hidden');
        status.text('');
        showError($(this));
        showPasswordAdvice();
        if ($(this).attr('id') === 'register-password' && confirmation.val() !== '') {
            showError(confirmation);
        }
    }

    function togglePassword() {
        const button = $(this);
        const input = button.closest('.password-field').find('input');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            button.find('span').text(input.is(confirmation) ? 'Hide password confirmation' : 'Hide password');
        } else {
            input.attr('type', 'password');
            button.find('span').text(input.is(confirmation) ? 'Show password confirmation' : 'Show password');
        }
    }

    function clearFields() {
        // Clear values, remove error styling, and remove the invalid state in one chain.
        strength.text('');
        fields.val('').removeClass('is-invalid');
        fields.removeAttr('aria-invalid');
        form.find('.field-error').text('').addClass('state-hidden');
        password.add(confirmation).attr('type', 'password');
        $('#toggle-password span').text('Show password');
        $('#toggle-confirmation span').text('Show password confirmation');
    }

    function submitForm(event) {
        // Prevent a page reload while the form is checked in the browser.
        event.preventDefault();
        success.stop(true, true).addClass('state-hidden');
        let valid = true;
        fields.each(function () {
            const field = $(this);
            // Preserve password spaces: confirmation must match the exact password.
            if (field.attr('id') !== 'register-password' && field.attr('id') !== 'register-confirm') {
                field.val(field.val().trim());
            }
            if (!showError(field)) valid = false;
        });
        if (!valid) {
            status.text('Correct the fields marked below.');
            form.find('.is-invalid').first().trigger('focus');
            return;
        }

        success.empty();
        $('<strong></strong>').text('Details checked for ' + $('#register-name').val() + '.').appendTo(success);
        $('<p class="mb-0"></p>').text('Email: ' + $('#register-email').val() + ' · Phone: ' + $('#register-phone').val()).appendTo(success);
        $('<p class="small mb-0"></p>').text('Your password fields have been cleared for security.').appendTo(success);
        clearFields();
        success.removeClass('state-hidden').fadeOut(0).fadeIn(250);
        status.text('');
    }

    function resetForm(event) {
        // Prevent the later native reset; clearFields performs our complete reset.
        event.preventDefault();
        clearFields();
        success.stop(true, true).addClass('state-hidden');
        status.text('Form cleared.');
    }

    form.find('.password-toggle').on('click', togglePassword);
    form.on('input change', 'input', handleEdit);
    form.on('submit', submitForm);
    form.on('reset', resetForm);
});
