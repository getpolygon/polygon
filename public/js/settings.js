import Alert from "/components/alert-component.mjs";

const PrivacySection = document.getElementById("privacy");
const PublicAccountButton = document.getElementById("opn_acc");
const PrivateAccountButton = document.getElementById("prv_acc");

const DeleteAccountSection = document.getElementById("delete_account_section");
const DeleteAccountButton = document.getElementById("deleteAccount");

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
    .then(() => {
      const alert = new Alert().create(
        "Your account has been deleted. <a href='/'>Go back to the main page</a>",
        {
          type: "success"
        }
      );
      const div = document.createElement("div");
      div.innerHTML = alert;
      DeleteAccountSection.firstChild.remove(self);
      DeleteAccountSection.prepend(div);
      DeleteAccountButton.setAttribute("disabled", true);
    })
    .catch((e) => (msg.innerText = e.toString()));
}

const MakePublic = async () => {
  try {
    const req = await fetch("/api/accounts/update/?privacy=false", { method: "PUT" });
    console.log(await req.json());
    const alert = new Alert().create("Successfuly updated privacy settings", { type: "success" });
    const div = document.createElement("div");
    div.innerHTML = alert;
    PrivacySection.firstChild.remove(self);
    PrivacySection.prepend(div);
  } catch (err) {
    const alert = new Alert().create(`There was an error. ${err}`, { type: "danger" });
    const div = document.createElement("div");
    div.innerHTML = alert;
    PrivacySection.firstChild.remove(self);
    PrivacySection.prepend(div);
  }
};
const MakePrivate = async () => {
  try {
    const req = await fetch("/api/accounts/update/?privacy=true", { method: "PUT" });
    console.log(await req.json());
    const alert = new Alert().create("Successfuly updated privacy settings", { type: "success" });
    const div = document.createElement("div");
    div.innerHTML = alert;
    PrivacySection.firstChild.remove(self);
    PrivacySection.prepend(div);
  } catch (err) {
    const alert = new Alert().create(`There was an error. ${err}`, { type: "danger" });
    const div = document.createElement("div");
    div.innerHTML = alert;
    PrivacySection.firstChild.remove(self);
    PrivacySection.prepend(div);
  }
};

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

DeleteAccountButton.addEventListener("click", deleteAccount);
PrivateAccountButton.addEventListener("click", async () => {
  await MakePrivate();
});
PublicAccountButton.addEventListener("click", async () => {
  await MakePublic();
});
SaveAccountButton.addEventListener("click", updateCredentials);
SaveBasicInfoButton.addEventListener("click", updateBasicInfo);
