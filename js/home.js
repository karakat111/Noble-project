'use strict';

// jQuery 3.7.1 replaces createElement, textContent, classList and addEventListener from the old Home feature.
// The form is created in code so the HTML freeze is respected.
$(document).ready(function () {
    const { products, findProduct, money, randomProduct } = StudentShop;
    const $main = $('main');
    let previousId = '';

    const $discovery = $('<section>', {
        id: 'product-discovery',
        'class': 'mt-5 border-top pt-4'
    });
    const $discoveryResult = $('<div>', {
        id: 'discovery-result',
        'class': 'mb-3',
        'aria-live': 'polite'
    });
    const $discoverButton = $('<button>', {
        id: 'discover-product',
        type: 'button',
        'class': 'btn btn-outline-secondary',
        text: 'Discover another piece'
    });

    $discovery.append(
        $('<h2>').text('Discover a piece'),
        $discoveryResult,
        $discoverButton
    ).appendTo($main);

    function fillDiscovery($result, product) {
        const $link = $('<a>', {
            'class': 'btn btn-outline-secondary',
            href: 'page-1.html?product=' + encodeURIComponent(product.id) + '#catalog-results',
            text: 'Explore this product'
        });
        $result.empty().append(
            $('<h3>', { 'class': 'h4' }).text(product.name),
            $('<p>').text(`${product.category} · ${money(product.price)}`),
            $link
        );
    }

    function showProduct($result, animate) {
        const product = randomProduct(previousId);
        previousId = product.id;
        if (!animate) {
            fillDiscovery($result, product);
            return;
        }
        $result.stop(true, true).fadeOut(150, function () {
            fillDiscovery($(this), product);
            $(this).fadeIn(200);
        });
    }

    showProduct($discoveryResult, false);

    // Delegation is attached to main because the discovery button was created after the original HTML loaded.
    $main.on('click', '#discover-product', function () {
        showProduct($(this).siblings('#discovery-result'), true);
    });

    const $section = $('<section>', {
        id: 'product-enquiry',
        'class': 'mt-5 border-top pt-4'
    });
    // html() is safe here because this is fixed trusted markup, never visitor input.
    $section.html('<h2>Demonstration product enquiry</h2><p>Practice planning an enquiry. Nothing is sent or saved, and no purchase or payment takes place.</p>');
    const $form = $('<form>', {
        id: 'enquiry-form',
        'class': 'row g-3',
        novalidate: 'novalidate'
    });
    const fields = {};
    const definitions = [
        { key: 'name', label: 'Your name', type: 'text', autocomplete: 'name' },
        { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
        { key: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
        { key: 'product', label: 'Product', type: 'select' },
        { key: 'quantity', label: 'Quantity (1–99)', type: 'number' },
        { key: 'budget', label: 'Total budget (₸)', type: 'number' }
    ];

    definitions.forEach(function (definition) {
        const id = 'enquiry-' + definition.key;
        const $wrapper = $('<div>', { 'class': 'col-12 col-md-6' });
        const $label = $('<label>', { 'class': 'form-label', for: id }).text(definition.label);
        const $field = definition.type === 'select'
            ? $('<select>', { 'class': 'form-select' })
            : $('<input>', { 'class': 'form-control', type: definition.type });
        const $error = $('<p>', { id: id + '-error', 'class': 'invalid-feedback' });

        $field.attr({ id: id, name: definition.key, 'aria-describedby': $error.attr('id') })
            .prop('required', true);
        if (definition.autocomplete) $field.attr('autocomplete', definition.autocomplete);
        if (definition.key === 'name') $field.attr('maxlength', '100');
        if (definition.key === 'email') $field.attr('maxlength', '254');
        if (definition.key === 'phone') $field.attr('maxlength', '20');
        if (definition.key === 'quantity') $field.attr({ min: '1', max: '99', step: '1' });
        if (definition.key === 'budget') $field.attr({ min: '1', step: '1' });

        $wrapper.append($label, $field, $error).appendTo($form);
        fields[definition.key] = $field;
    });

    fields.product.append($('<option>', { value: '', text: 'Choose a product' }));
    products.forEach(function (product) {
        $('<option>', {
            value: product.id,
            text: `${product.name} — ${money(product.price)}`
        }).appendTo(fields.product);
    });

    const requested = new URLSearchParams(window.location.search).get('product');
    if (findProduct(requested)) fields.product.val(requested);

    const $actions = $('<div>', { 'class': 'col-12 d-flex flex-wrap gap-2' });
    $actions.append(
        $('<button>', { type: 'submit', 'class': 'btn btn-secondary', text: 'Check demonstration enquiry' }),
        $('<button>', { type: 'reset', 'class': 'btn btn-outline-secondary', text: 'Clear enquiry' })
    );
    const $status = $('<p>', {
        id: 'enquiry-status',
        'class': 'col-12 text-break',
        role: 'status'
    }).hide();
    $form.append($actions, $status);
    $section.append($form).appendTo($main);

    function valuesFromForm() {
        const values = {};
        $.each(fields, function (key, $field) {
            values[key] = $.trim(String($field.val() || ''));
        });
        return values;
    }

    function validate(values) {
        const errors = {};
        const product = findProduct(values.product);
        const quantity = Number(values.quantity);
        const budget = Number(values.budget);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phonePattern = /^\+?[0-9\s()-]{10,18}$/;

        if (values.name.length < 2 || values.name.length > 100)
            errors.name = 'Enter a name between 2 and 100 characters.';
        if (!emailPattern.test(values.email)) errors.email = 'Enter a valid email address.';
        if (!phonePattern.test(values.phone)) errors.phone = 'Enter a valid phone number using 10–18 digits and common separators.';
        if (!product) errors.product = 'Choose a product from the catalogue.';
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
            errors.quantity = 'Enter a whole quantity from 1 to 99.';
        if (!Number.isSafeInteger(budget) || budget <= 0)
            errors.budget = 'Enter a positive whole budget in tenge.';
        else if (product && !errors.quantity && budget < product.price * quantity)
            errors.budget = `Budget must cover ${money(product.price * quantity)} for this quantity.`;
        return errors;
    }

    function showError($field, message) {
        $field.addClass('is-invalid').attr('aria-invalid', 'true');
        $field.siblings('.invalid-feedback').stop(true, true).text(message).show();
    }

    function clearField($field) {
        if ($field.hasClass('is-invalid')) $field.removeClass('is-invalid');
        $field.removeAttr('aria-invalid');
        // parent() finds the field wrapper and find() locates only this field's message.
        // Clearing is immediate so several corrected fields cannot make the submit button move during a click.
        $field.parent().find('.invalid-feedback').stop(true, true).hide().text('');
    }

    function clearAllErrors() {
        $form.find('input, select').each(function () {
            clearField($(this));
        });
    }

    $form.on('input change', 'input, select', function () {
        const $field = $(this);
        const key = String($field.attr('name'));
        const errors = validate(valuesFromForm());
        if (!errors[key]) clearField($field);
        if ($status.is(':visible')) $status.stop(true, true).fadeOut(120);
    });

    $form.on('submit', function (event) {
        // Without preventDefault(), the browser would navigate or reload before jQuery could show all errors.
        event.preventDefault();
        clearAllErrors();
        const values = valuesFromForm();
        const errors = validate(values);

        $.each(errors, function (key, message) {
            showError(fields[key], message);
        });

        const firstError = Object.keys(errors)[0];
        if (firstError) {
            fields[firstError].trigger('focus');
            $status.stop(true, true).text('Please correct the marked fields.').show();
            return;
        }

        const product = findProduct(values.product);
        const summary = `${values.name}: ${values.quantity} × ${product.name}, estimated total ` +
            `${money(product.price * Number(values.quantity))}. Nothing was sent or saved; no purchase or payment occurred.`;
        $form.trigger('reset');
        $status.html('<strong>Enquiry checked.</strong> ')
            .append($('<span>').text(summary))
            .stop(true, true).slideDown(250);
        // Browser validation helps visitors, but a real server must validate again because client code can be bypassed.
    });

    $form.on('reset', function () {
        clearAllErrors();
        $status.stop(true, true).hide().empty();
    });
});
