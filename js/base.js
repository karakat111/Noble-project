const showPasswordButton = document.querySelector("#show-passwords");
const Password = document.querySelector("#register-password");
const passwordConfirm = document.querySelector("#register-confirm");

function ShowPassword() {
    const areHidden = Password.type === "password";

    if (areHidden) {
        Password.type = "text";
        passwordConfirm.type = "text";
        showPasswordButton.textContent = "Hide passwords";
    } else {
        Password.type = "password";
        passwordConfirm.type = "password";
        showPasswordButton.textContent = "Show passwords";
    }
}

showPasswordButton.addEventListener("click", ShowPassword);


