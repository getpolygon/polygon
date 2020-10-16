const privateCheck = document.getElementById("privateCheck");
const submitButton = document.getElementById("submitButton")
const avatarInput = document.getElementById("avatar");

function checkboxValue() {
    let values = [];
    if (privateCheck.value = true) {
        privateCheck.value = false;
        values.push(privateCheck.value)
    };
    if (privateCheck.value = false) {
        privateCheck.value = true;
        values.push(privateCheck.value)
    };
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

        var file = new File([avatarInput.files[0]], `${Date.now()}.jpeg`, { type: "image/png" }) // use the Blob or File API
        avatarImagesRef.put(file).then(function (snapshot) {
            console.log('Uploaded the profile picture to firebase');
            console.log(snapshot);
        });

        imgErr.innerHTML = "";

    }
    if (email.value < 18) {
        avatarInput.files.length = 0;
        console.log("Broke the loop");
        avatarInput.value = "";
        imgErr.innerHTML = "<small>Please enter your email and choose a file again</small>";
    }
    else {
        // Create a reference to the file to delete
        var desertRef = storageRef.child(`${email.value}.jpg`);

        // Delete the file
        desertRef.delete()
            .catch(function (error) {
                console.log(error);
            });

        // Create a root reference
        var storageRef = firebase.storage().ref();
        // Create a reference to 'images'
        var avatarImagesRef = storageRef.child(`${email.value}.jpg`);
        // While the file names are the same, the references point to different files
        avatarImagesRef.name === avatarImagesRef.name            // true
        avatarImagesRef.fullPath === avatarImagesRef.fullPath    // false

        var file = new File([avatarInput.files[0]], `${Date.now()}.jpeg`, { type: "image/png" }) // use the Blob or File API
        avatarImagesRef.put(file).then(function (snapshot) {
            console.log('Uploaded the profile picture to firebase');
        });
    }
}

privateCheck.addEventListener("click", checkboxValue);
avatarInput.addEventListener("change", uploadFile);
