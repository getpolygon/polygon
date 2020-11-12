let body = document.body;
let themeButton = document.getElementById("theme");
let themeIcon = document.getElementById("themeIcon");
let background = document.querySelectorAll(".bg-white");
let text = document.querySelectorAll(".text-dark");
let buttons = document.querySelectorAll(".btn-dark");

function changeTheme() {
  background.forEach((obj) => {
    if (obj.classList.contains("bg-white")) {
      obj.classList.remove("bg-white");
      obj.classList.add("bg-dark");
    } else {
      obj.classList.remove("bg-dark");
      obj.classList.add("bg-white");
    }
  });
  text.forEach((obj) => {
    if (obj.classList.contains("text-white")) {
      obj.classList.remove("text-white");
      obj.classList.add("text-dark");
    } else {
      obj.classList.remove("text-dark");
      obj.classList.add("text-white");
    }
  });
  buttons.forEach((obj) => {
    if (obj.classList.contains("btn-dark")) {
      obj.classList.remove("btn-dark");
      obj.classList.add("btn-light");
    } else {
      obj.classList.remove("btn-light");
      obj.classList.add("btn-dark");
    }
  });
  if (themeIcon.classList.contains("fa-sun")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

themeButton.addEventListener("click", changeTheme);
