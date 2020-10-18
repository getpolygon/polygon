const submitButton = document.getElementById("submitButton");
const avatarInput = document.getElementById("avatar");
var privateCheck = document.getElementById("privateCheck");

function checkboxValue() {
    if (privateCheck.checked) {
        privateCheck.setAttribute("value", true);
        console.log(privateCheck.value);
    }
    else {
        privateCheck.setAttribute("value", false);
        console.log(privateCheck.value);
    }
    // $(privateCheck).text($('#privateCheck').val());

    // $("#privateCheck").on('change', function () {
    //     if ($(this).is(':checked')) {
    //         $(this).attr('value', 'true');
    //     } else {
    //         $(this).attr('value', 'false');
    //     }

    //     $('#checkbox-value').text($('#privateCheck').val());
    // });
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
        imgErr.innerHTML = "";

    }
    if (email.value == 0 || email.value < 7) {
        avatarInput.files.length = 0;
        avatarInput.value = "";
        imgErr.innerHTML = "<small>Please enter your email. Email either has less than 7 characters or s empty.</small>";
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
    let fullName = document.getElementById("fullName");

    if (email.value < 8 || password.value < 8) {
        submitButton = submitButton;
    } else {
        submitButton.classList.remove("button is-info");
        submitButton.classList.add("button is-info is-loading");
    }
}

submitButton.addEventListener("click", checkForm);
privateCheck.addEventListener("click", checkboxValue);
avatarInput.addEventListener("change", uploadFile);