const password = document.querySelector("#register-password");
const passwordConfirmation = document.querySelector("#register-confirm");
const passwordButton = document.querySelector("#toggle-password");
const confirmationButton = document.querySelector("#toggle-confirmation");

function togglePassword(input, button) {
    const passwordIsHidden = input.type === "password";
    const buttonText = button.querySelector(".visually-hidden");

    if (passwordIsHidden) {
        input.type = "text";
        buttonText.textContent = "Hide password";
    } else {
        input.type = "password";
        buttonText.textContent = "Show password";
    }
}

function toggleFirstPassword() {
    togglePassword(password, passwordButton);
}

function toggleConfirmationPassword() {
    togglePassword(passwordConfirmation, confirmationButton);
}

passwordButton.addEventListener("click", toggleFirstPassword);
confirmationButton.addEventListener("click", toggleConfirmationPassword);


