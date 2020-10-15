var privateCheck = document.getElementById("privateCheck");

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
