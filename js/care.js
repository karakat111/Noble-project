const form = document.querySelector('#care-checklist-form');
const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
const progress = document.querySelector('#care-progress');
const success = document.querySelector('#care-success');


function calculateProgress(inputs) {
    const completed = inputs.filter(input => input.checked).length;
    return { completed: completed, total: inputs.length, percent: Math.round(completed / inputs.length * 100) };
}

function updateProgress() {
    const result = calculateProgress(checks);
    progress.textContent = result.completed + ' of ' + result.total + ' checks completed (' + result.percent + '%).';
    success.classList.toggle('state-hidden', result.completed !== result.total);
    checks.forEach(input => input.closest('.form-check').classList.toggle('state-selected', input.checked));
}

function resetChecklist(event) {
    event.preventDefault();
    checks.forEach(input => { input.checked = false; });
    updateProgress();
    progress.textContent += ' Checklist cleared.';
}

form.addEventListener('change', updateProgress);
form.addEventListener('reset', resetChecklist);
form.addEventListener('submit', event => event.preventDefault());
updateProgress();

