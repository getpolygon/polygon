const navbar = document.getElementById("navbar");
const burger = document.getElementById("navbar-burger");


function activeNabar() {
    if (burger.classList.contains("is-active")) {
        burger.classList.remove("is-active");
        navbar.classList.remove("is-active");

    } else {
        burger.classList.add("is-active");
        navbar.classList.add("is-active");
    };
};

burger.addEventListener("click", activeNabar);
