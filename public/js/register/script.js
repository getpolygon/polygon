let submitButton = document.getElementById("submitButton");
let avatarInput = document.getElementById("avatar");
let emailStatus = document.getElementById("emailStatus");
let privateCheck = document.getElementById("privateCheck");
let email = document.getElementById("email");
function checkboxValue() {
  if (privateCheck.checked) {
    privateCheck.setAttribute("value", true);
  } else {
    privateCheck.setAttribute("value", false);
  }
}
function checkEmail() {
  // TODO: MAybe update the API for this
  fetch("/api/accounts/check/?q=email", {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${email.value}`,
  })
    .then((response) => response.json())
    .then((response) => {
      let password = document.getElementById("password");
      let bio = document.getElementById("bio");
      // Disallow user to create an account if found a duplicate ( if the email is valid )
      if (response.result == true) {
        emailStatus.innerText = "There is an account with this email";
        emailStatus.classList.remove("ok");
        emailStatus.classList.add("error");
        // Disable all the inputs
        password.setAttribute("disabled", true);
        bio.setAttribute("disabled", true);
        avatarInput.setAttribute("disabled", true);
        privateCheck.setAttribute("disabled", true);
        submitButton.setAttribute("disabled", true);
      }
      // Allow the user to create an account if duplicates weren't found ( if the email is valid )
      if (response.result == false) {
        emailStatus.innerText = "You can use this email";
        emailStatus.classList.remove("error");
        emailStatus.classList.add("ok");
        // Enable all the inputs
        password.removeAttribute("disabled");
        bio.removeAttribute("disabled");
        avatarInput.removeAttribute("disabled");
        privateCheck.removeAttribute("disabled");
        submitButton.removeAttribute("disabled");
      }
      // Disallow the user to create an account if the email is not valid
      if (response.emailValidity == false) {
        emailStatus.innerText = "Please enter a valid email";
        emailStatus.classList.remove("ok");
        emailStatus.classList.add("error");
        // Disable all the inputs
        password.setAttribute("disabled", true);
        bio.setAttribute("disabled", true);
        avatarInput.setAttribute("disabled", true);
        privateCheck.setAttribute("disabled", true);
        submitButton.setAttribute("disabled", true);
      }
    });
}

email.addEventListener("keyup", checkEmail);
privateCheck.addEventListener("click", checkboxValue);
