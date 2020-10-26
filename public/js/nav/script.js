let logoutForm = document.getElementById("logout");
let logoutButton = document.getElementById("submitLogout");

logoutButton.addEventListener("click", () => {
  logoutForm.submit();
});
