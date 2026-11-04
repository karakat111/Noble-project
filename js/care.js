// jQuery 3.7.1 full build includes effects. Ready waits for the checklist HTML.
$(function () {
    // Rewrite 2: .find(), :checked, .prop() and .each() replace querySelectorAll,
    // array filtering and input.checked. Counting checked boxes is shorter in jQuery.
    const form = $('#care-checklist-form');
    const checks = form.find('input[type="checkbox"]');
    const progress = $('#care-progress');
    const success = $('#care-success');

    const storageKey = 'noble-care-checklist-v1';
    const storageNote = $('#care-checklist .fine-print');

    function saveChecks() {
        const saved = [];
        checks.each(function () {
            if ($(this).prop('checked')) saved.push(this.id);
        });
        try {
            localStorage.setItem(storageKey, JSON.stringify(saved));
            storageNote.text('Your checks are saved in this browser. Reset clears them.');
        } catch {
            storageNote.text('Storage is unavailable. Your checks last only on this page.');
        }
    }

    function restoreChecks() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (!Array.isArray(saved)) {
                storageNote.text('Saved checks could not be read. Start again or press Reset.');
                return;
            }
            checks.each(function () { $(this).prop('checked', saved.includes(this.id)); });
            storageNote.text('Your checks are saved in this browser. Reset clears them.');
        } catch {
            storageNote.text('Saved checks could not be read. Your checklist still works on this page.');
        }
    }

    function updateProgress() {
        success.stop(true, true);
        const completed = checks.filter(':checked').length;
        const percent = Math.round(completed / checks.length * 100);
        progress.text(completed + ' of ' + checks.length + ' complete · ' + percent + '%');
        checks.each(function () {
            // .prop('checked') reads the live checkbox state; .attr('checked')
            // describes the initial HTML attribute and does not track user clicks.
            $(this).closest('.form-check').toggleClass('state-selected', $(this).prop('checked'));
        });
        if (completed === checks.length && success.hasClass('state-hidden')) {
            success.stop(true, true).removeClass('state-hidden').slideUp(0).slideDown(200);
        } else if (completed !== checks.length && !success.hasClass('state-hidden')) {
            success.stop(true, true).slideUp(200, function () {
                $(this).addClass('state-hidden');
            });
        }
    }

    function resetChecklist(event) {
        // Without preventDefault(), the browser resets after this handler, so the
        // progress calculation would still see the old values during the handler.
        event.preventDefault();
        checks.prop('checked', false);
        updateProgress();
        saveChecks();
        progress.append(' Checklist cleared.');
    }

    function preventSubmit(event) {
        // A checklist has nothing to send; otherwise the form would navigate.
        event.preventDefault();
    }

    form.on('change', 'input[type="checkbox"]', function () {
        updateProgress();
        saveChecks();
    });
    form.on('reset', resetChecklist);
    form.on('submit', preventSubmit);
    restoreChecks();
    updateProgress();
});
