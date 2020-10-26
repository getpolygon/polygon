let deleteButton = document.getElementById("deleteAccount");
let privacyCheckbox = document.getElementById("isPrivate");

function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return value != null ? unescape(value[1]) : null;
}

function deleteUserImage() {
  // Create a root reference
  var storageRef = firebase.storage().ref();
  let email = getCookie("email");
  // Create a reference to the file to delete
  var desertRef = storageRef.child(email + ".jpg");
  // Delete the file
  desertRef.delete().catch((error) => (error = error));
}

function deleteAccount() {
  let msg = document.getElementById("message");
  fetch("/api/deleteAccount", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
    .then((res) => res.json())
    .then((res) => {
      msg.innerHTML =
        "Your account has been deleted. <a href='/'>Go back to the main page</a>";
      deleteUserImage;
    })
    .catch((e) => (msg.innerText = e.toString()));
}

function updatePrivacy() {
  let msg = document.getElementById("acUpdateStatus");
  let currentStatus = document.getElementById("currentStatus");

  if (privacyCheckbox.checked) {
    privacyCheckbox.setAttribute("value", true);
    fetch("/api/updateAccount/?privacy=true", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
    fetch("/api/updateAccount/?privacy=false", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

deleteButton.addEventListener("click", deleteAccount);
privacyCheckbox.addEventListener("change", updatePrivacy);