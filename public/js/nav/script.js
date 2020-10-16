const dropdownDiv = document.getElementById("dropdown");
const dropdownButton = document.getElementById("dropdownTrigger");

const logoutButton = document.getElementById("logoutButton");
const logoutForm = document.getElementById("logoutForm");

function dropdown() {
    if (dropdownDiv.classList.contains("is-active")) {
        dropdownDiv.classList.remove("is-active");
    } else {
        dropdownDiv.classList.add("is-active");
    };
};

function logout() {
    logoutForm.submit();
}

dropdownButton.addEventListener("click", dropdown);
logoutButton.addEventListener("click", logout);