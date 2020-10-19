const navbar = document.getElementById("navbar");
const burger = document.getElementById("navbar-burger");
const svgList = ["homeSVG", "usersSVG", "searchSVG", "moreSVG"];

function activeNabar() {
    if (burger.classList.contains("is-active")) {
        burger.classList.remove("is-active");
        navbar.classList.remove("is-active");

    } else {
        burger.classList.add("is-active");
        navbar.classList.add("is-active");
    };
};

function checkWndowSize() {
    var screenWidth = screen.width;

    if (screenWidth < 1024) {
        svgList.forEach(item => {
            document.getElementById(item).style.display = "none";
        })
    } else {
        svgList.forEach(item => {
            document.getElementById(item).style.display = "block";
        })
    }
}

burger.addEventListener("click", activeNabar);
window.addEventListener("resize", checkWndowSize);
window.onload = checkWndowSize;

