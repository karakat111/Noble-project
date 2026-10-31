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

    // New HTML must be created in code under the assignment's HTML/CSS freeze.
    const phoneGroup = $('<div class="mb-3"></div>');
    $('<label class="form-label" for="register-phone">Phone number</label>').appendTo(phoneGroup);
    $('<input class="form-control" id="register-phone" name="phone" type="tel" autocomplete="tel" placeholder="+77001234567" maxlength="16" required>').appendTo(phoneGroup);
    $('#register-email').parent().after(phoneGroup);
    const fields = form.find('input');
    fields.each(function () {
        const field = $(this);
        const id = field.attr('id') + '-error';
        let anchor = field;
        if (field.parent().hasClass('password-field')) {
            anchor = field.parent();
        }
        $('<p class="field-error state-error state-hidden small mt-2"></p>').attr('id', id).appendTo(anchor.parent());
        field.attr('aria-describedby', id);
    });
    // Keep required/type/minlength attributes as baseline constraints. Disable only
    // browser popups so submit can report every field error next to its field.
    form.prop('noValidate', true);

    function validateField(field) {
        const value = field.val().trim();
        const id = field.attr('id');
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
        if ((id === 'register-password' || id === 'register-confirm') && value.length < 8) {
            return 'Use at least 8 characters.';
        }
        if (id === 'register-confirm' && value !== password.val().trim()) {
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
        field.toggleClass('is-invalid', text !== '').attr('aria-invalid', String(text !== ''));
        return text === '';
    }

    function handleEdit() {
        success.stop(true, true).addClass('state-hidden');
        status.text('No account has been created.');
        showError($(this));
        if ($(this).attr('id') === 'register-password' && confirmation.val() !== '') {
            showError(confirmation);
        }
    }

    function togglePassword() {
        const button = $(this);
        const input = button.closest('.password-field').find('input');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            button.attr('aria-pressed', 'true').find('span').text('Hide password');
        } else {
            input.attr('type', 'password');
            button.attr('aria-pressed', 'false').find('span').text('Show password');
        }
    }

    function clearFields() {
        // Clear values, remove error styling, and remove the invalid state in one chain.
        fields.val('').removeClass('is-invalid').removeAttr('aria-invalid');
        form.find('.field-error').text('').addClass('state-hidden');
        password.add(confirmation).attr('type', 'password');
        form.find('.password-toggle').attr('aria-pressed', 'false').find('span').text('Show password');
    }

    function submitForm(event) {
        // Otherwise the POST form would navigate/send these sample details.
        event.preventDefault();
        success.stop(true, true).addClass('state-hidden');
        let valid = true;
        fields.each(function () {
            const field = $(this);
            field.val(field.val().trim());
            if (!showError(field)) valid = false;
        });
        if (!valid) {
            status.text('Correct the fields marked below.');
            return;
        }
        // Browser checks can be bypassed; a real server must validate again.
        // .html() parses this fixed markup; user-entered values always use .text().
        success.html('<strong>Form checked successfully.</strong> No account has been created.');
        clearFields();
        success.removeClass('state-hidden').fadeOut(0).fadeIn(250);
        status.text('All checks passed. The form has been cleared.');
    }

    function resetForm(event) {
        // Prevent the later native reset; clearFields performs our complete reset.
        event.preventDefault();
        clearFields();
        success.stop(true, true).addClass('state-hidden');
        status.text('Form cleared. No account has been created.');
    }

    form.find('.password-toggle').attr('aria-pressed', 'false').on('click', togglePassword);
    form.on('input change', 'input', handleEdit);
    form.on('submit', submitForm);
    form.on('reset', resetForm);
});

