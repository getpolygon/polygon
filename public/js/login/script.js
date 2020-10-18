let submitButton = document.getElementById("submitButton");

function submitForm() {
    let password = document.getElementById("password");

    if (password.value.length < 8) {
        submitButton = submitButton;
    }
    else {
        submitButton.classList.add("is-loading")
    };

}

submitButton.addEventListener("click", submitForm);
