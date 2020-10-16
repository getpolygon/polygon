let submitButton = document.getElementById("submitButton");

function submitForm() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (email < 1 || password < 1) {
        submitButton = submitButton;
    } else {
        submitButton.classList.add("is-loading")
    };

}

submitButton.addEventListener("click", submitForm);
