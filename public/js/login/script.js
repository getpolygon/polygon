const privateCheck = document.getElementById("privateCheck");
const submitButton = document.getElementById("submitButton")

function checkboxValue() {
    let values = [];
    if (privateCheck.value = true) {
        privateCheck.value = false;
        values.push(privateCheck.value)
    }
    if (privateCheck.value = false) {
        privateCheck.value = true;
        values.push(privateCheck.value)
    }
}

privateCheck.addEventListener("click", checkboxValue);
submitButton.addEventListener("click", () => {
    let fullName = document.getElementById("fullName");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (fullName.value < 1 || email.value < 1 || password.value < 1) {
        submitButton = submitButton;
    } else {
        // TODO: Add a button with a loader
        submitButton = submitButton;
    }

})
