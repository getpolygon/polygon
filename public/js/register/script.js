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

function checkEmail() {
  fetch("/api/checkEmail",
    {
      method: "POST",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${email.value}`
    })
    .then((res) => { return res.json() })
    .then((response) => {

      let password = document.getElementById("password");
      let bio = document.getElementById("bio");

      if (response.result == true) {
        // Disallow user to create an account if found a duplicate ( if the email is valid )
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

      if (response.result == false) {

        // Allow the user to create an account if duplicates weren't found ( if the email is valid )
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

      if (response.emailValidity == false) {

        // Disallow the user to create an account if the email is not valid
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
    }
    )
}

email.addEventListener('keyup', checkEmail);
avatarInput.addEventListener("change", uploadFile);
privateCheck.addEventListener("click", checkboxValue);
submitButton.addEventListener("click", checkForm);
