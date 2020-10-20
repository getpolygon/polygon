let submitButton = document.getElementById("submitButton");
let avatarInput = document.getElementById("avatar");
let emailStatus = document.getElementById("emailStatus");
let privateCheck = document.getElementById("privateCheck");
let email = document.getElementById("email");

function checkboxValue() {
  if (privateCheck.checked) {
    privateCheck.setAttribute("value", true);
    console.log(privateCheck.value);
  }
  else {
    privateCheck.setAttribute("value", false);
    console.log(privateCheck.value);
  }
};

function uploadFile() {

  // Email in the body
  let email = document.getElementById("email");

  // Image Error Container
  let imgErr = document.getElementById("imgError");

  // Create a root reference
  var storageRef = firebase.storage().ref();

  // If there is an image replace it with the new one and delete from firebase else create a new image
  if (avatarInput.files.length < 1) {
    // Create a reference to 'images'
    var avatarImagesRef = storageRef.child(`${email.value}.jpg`);
    // While the file names are the same, the references point to different files
    avatarImagesRef.name === avatarImagesRef.name            // true
    avatarImagesRef.fullPath === avatarImagesRef.fullPath    // false

    var file = new File([avatarInput.files[0]], `${email.value}.jpeg`, { type: "image/png" }) // use the Blob or File API
    avatarImagesRef.put(file);
    avatarInput.classList.add("ok");
    avatarInput.classList.remove("error");
    imgErr.classList.add("ok");
    imgErr.classList.remove("error");
    imgErr.innerHTML = "Image Uploaded";

  }
  if (email.value == 0 || email.value < 7) {
    avatarInput.files.length = 0;
    avatarInput.value = "";
    avatarInput.classList.remove("ok");
    avatarInput.classList.add("error");
    imgErr.classList.remove("ok");
    imgErr.classList.add("error");
    imgErr.innerHTML = "<small>Please enter your email. Email either has less than 7 characters or s empty.</small>";
  }
  if (emailStatus.textContent.startsWith("T")) {
    avatarInput.files.length = 0;
    avatarInput.value = "";
    imgErr.classList.remove("ok");
    imgErr.classList.add("error");
    imgErr.innerHTML = "<small>Sorry. The email you've entered is being used by another account. Try to login</small>";
    console.log(emailStatus.value);
  }
  if (emailStatus.textContent.startsWith("Y")) {
    // Create a reference to 'images'
    var avatarImagesRef = storageRef.child(`${email.value}.jpg`);
    // While the file names are the same, the references point to different files
    avatarImagesRef.name === avatarImagesRef.name            // true
    avatarImagesRef.fullPath === avatarImagesRef.fullPath    // false

    var file = new File([avatarInput.files[0]], `${email.value}.jpeg`, { type: "image/png" }) // use the Blob or File API
    avatarImagesRef.put(file);
    avatarInput.classList.add("ok");
    avatarInput.classList.remove("imgError");
    imgErr.classList.add("ok");
    imgErr.classList.remove("error");
    imgErr.innerHTML = "Image Uploaded";
  }
  else {
    // Create a reference to the file to delete
    var desertRef = storageRef.child(`${email.value}.jpg`);

    // Delete the file
    desertRef.delete()
      .catch((error) => error = error);

    // Create a root reference
    var storageRef = firebase.storage().ref();
    // Create a reference to 'images'
    var avatarImagesRef = storageRef.child(`${email.value}.jpg`);
    // While the file names are the same, the references point to different files
    avatarImagesRef.name === avatarImagesRef.name            // true
    avatarImagesRef.fullPath === avatarImagesRef.fullPath    // false

    var file = new File([avatarInput.files[0]], `${email.value}.jpeg`, { type: "image/png" }) // use the Blob or File API
    avatarImagesRef.put(file);
  }
}

function checkForm() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (email.value < 8 || password.value < 8) {
    submitButton = submitButton;
  } else {
    submitButton.classList.remove("button is-info");
    submitButton.classList.add("button is-info is-loading");
  }
}

avatarInput.addEventListener("change", uploadFile);
submitButton.addEventListener("click", checkForm);
privateCheck.addEventListener("click", checkboxValue);
email.addEventListener("keyup", async () => {
  await fetch("/api/checkEmail",
    {
      method: "POST",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${email.value}`
    })
    .then((res) => { return res.json() })
    .then((response) => {
      let email = document.getElementById("email");
      let password = document.getElementById("password");
      let bio = document.getElementById("bio");

      // If the API responds with true (duplicate)
      if (response.result == true) {

        // Disallow user to create an account
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
      // If the API responds with false (not duplicate or null)
      else {

        // If the email input value doesn't include "@" or "." signs disallow the user to create an account 
        if (!email.value.includes("@") || !email.value.includes(".")) {
          emailStatus.innerText = "Enter a valid email";
          emailStatus.classList.add("error");
          emailStatus.classList.remove("ok");

          // Disable all the inputs
          password.setAttribute("disabled", true);
          bio.setAttribute("disabled", true);
          avatarInput.setAttribute("disabled", true);
          privateCheck.setAttribute("disabled", true);
          submitButton.setAttribute("disabled", true);
        }

        // If there are all the required characters let the person create an account
        else {
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
      }
    })
})