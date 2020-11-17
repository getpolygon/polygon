const deleteButton = document.getElementById("deleteAccount");
const privacyCheckbox = document.getElementById("isPrivate");
const passwordField = document.getElementById("password");
const emailField = document.getElementById("email");
const SaveAccountButton = document.getElementById("accountSave");

function deleteAccount() {
  const msg = document.getElementById("message");
  fetch("/api/accounts/delete", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      msg.innerHTML =
        "<p class='mt-3'>Your account has been deleted. <a href='/'>Go back to the main page</a></p>";
    })
    .catch((e) => (msg.innerText = e.toString()));
}

function updatePrivacy() {
  const msg = document.getElementById("acUpdateStatus");
  const currentStatus = document.getElementById("currentStatus");

  if (privacyCheckbox.checked) {
    privacyCheckbox.setAttribute("value", true);
    fetch("/api/accounts/update/?privacy=true", {
      method: "PUT",
    })
      .then((res) => {
        res.json();
        msg.innerText = "";
      })
      .then((_res) => {
        msg.innerText = "OK. UPDATED";
        currentStatus.innerText = "Private Account";
        setTimeout(() => (msg.innerText = ""), 3000);
      })
      .catch((e) => {
        msg.innerText = e.toString();
      });
  } else {
    privacyCheckbox.setAttribute("value", false);
    fetch("/api/accounts/update/?privacy=false", {
      method: "PUT",
    })
      .then((res) => {
        res.json();
        msg.innerText = "";
      })
      .then((_res) => {
        msg.innerText = "OK. UPDATED";
        currentStatus.innerText = "Public Account";
        setTimeout(() => (msg.innerText = ""), 3000);
      })
      .catch((e) => {
        msg.innerText = e.toString();
      });
  }
}

function updateCredentials() {
  const email = emailField.value;
  const password = passwordField.value;
  const msg = document.createElement("div");
  fetch(`/api/accounts/update/?email=${email}&password=${password}`, {
    method: "PUT",
  })
    .then((data) => data.json())
    .then((_data) => {
      msg.innerHTML = `
        <div class="alert alert-success" role="alert">
          Your account has been updated
          <i class="fas fa-check"></i>
        </div>
        `;
    })
    .catch((e) => {
      msg.innerHTML = `
      <div class="alert alert-danger" role="alert">
        It looks like we are having some trouble updating your account
        <i class="far fa-frown"></i>
        Try to refresh the page
      </div>
      `;
      console.error(e);
    });
  document.body.prepend(msg);
}

deleteButton.addEventListener("click", deleteAccount);
privacyCheckbox.addEventListener("change", updatePrivacy);
SaveAccountButton.addEventListener("click", updateCredentials);
