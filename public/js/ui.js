const LogoText = document.querySelector(".logo-text");
const NavAccountName = document.querySelector(".nav-account-name");

// Removing account name and logo text on resize if width is less than 425
const Responsive = () => {
  if (LogoText) {
    if (window.innerWidth <= 768) {
      LogoText.style.display = "none";
      NavAccountName.style.display = "none";
    } else {
      LogoText.style.display = "inline";
      NavAccountName.style.display = "inline";
    }
  }
};

window.onload = () => Responsive();
window.onresize = () => Responsive();
