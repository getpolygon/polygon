var privateCheck = document.getElementById("privateCheck");

function checkboxValue() {
    if (privateCheck.checked) {
        privateCheck.checked = false;
    }
    if (!privateCheck.checked) {
        privateCheck.checked = true;
    }
}

privateCheck.addEventListener("click", checkboxValue);
