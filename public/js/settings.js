import Alert from "/components/alert-component.mjs";

const deleteButton = document.getElementById("deleteAccount");
const privacyCheckbox = document.getElementById("isPrivate");
const SaveAccountButton = document.getElementById("accountSave");
const SaveBasicInfoButton = document.getElementById("accountSaveBasic");

const passwordField = document.getElementById("password");
const emailField = document.getElementById("email");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");

function deleteAccount() {
  const msg = document.getElementById("message");
  fetch("/api/accounts/delete", {
    method: "DELETE"
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
      method: "PUT"
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
      method: "PUT"
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
    method: "PUT"
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status === "ERR_ACC_EXISTS") {
        msg.innerHTML = new Alert().create("There is an account using that email.", {
          type: "danger"
        });
      } else {
        msg.innerHTML = new Alert().create("Your account has been updated", {
          type: "success"
        });
      }
    })
    .catch((e) => {
      msg.innerHTML = new Alert().create(
        "It looks like we are having some trouble updating your account. Try to refresh the page",
        { type: "danger" }
      );
      console.error(e);
    });
  document.body.prepend(msg);
}

function updateBasicInfo() {
  const container = document.createElement("div");
  fetch(`/api/accounts/update/?firstName=${firstNameField.value}&lastName=${lastNameField.value}`, {
    method: "PUT"
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "OK") {
        console.log(res);
        container.innerHTML = new Alert().create("Your account has been updated", {
          type: "success"
        });
      }
    })
    .catch((e) => {
      console.log(e);
      container.innerHTML = new Alert().create(
        "It looks like we are having some trouble updating your account",
        { type: "danger" }
      );
    });
}

deleteButton.addEventListener("click", deleteAccount);
privacyCheckbox.addEventListener("change", updatePrivacy);
SaveAccountButton.addEventListener("click", updateCredentials);
SaveBasicInfoButton.addEventListener("click", updateBasicInfo);
