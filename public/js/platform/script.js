const postButton = document.getElementById("postButton");
const postText = document.getElementById("postTextarea");

// Classes that are going to be added to the cards
const classes = [];
// Classes that are going to be added to the posters name divs
const authorNameClasses = ["title", "is-3"];
// Classes that are going to be added to the post's text
const postTextClasses = ["subtitle"];

// Function for reading cookies on the client side
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function fetchPosts() {
    fetch("/api/fetchPosts")
        .then(res => res.json())
        .then(data => {
            data.forEach(obj => {
                let text = obj.text;
                let author = obj.author;
                let authorId = obj.authorId;
                let authorImage = obj.authorImage;
                let postsContainer = document.getElementById("posts");
                let cardContainer = document.createElement("div");
                let cardText = document.createElement("p");
                let cardAuthor = document.createElement("a");
                let cardAuthorImage = document.createElement("img");

                classes.forEach(obj => cardContainer.classList.add(obj));
                postTextClasses.forEach(obj => cardText.classList.add(obj));
                authorNameClasses.forEach(obj => cardAuthor.classList.add(obj));

                cardAuthorImage.src = authorImage;
                cardAuthor.innerHTML = `<br>${author}`;
                cardAuthor.href = `/user/${authorId}`;
                cardText.innerText = text;
                cardAuthor.classList.add(authorNameClasses);
                cardAuthorImage.classList.add("image-rounded");
                cardContainer.appendChild(cardAuthorImage);
                cardContainer.appendChild(cardAuthor);
                cardContainer.appendChild(cardText);
                postsContainer.appendChild(cardContainer);
                postText.value = "";
            })
        })
        .catch(e => console.log(e));
}

function createPost() {
    fetch("/api/createPost",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${postText.value}`
        })
        .then(res => res.json())
        .then(data => {
            let text = data.text;
            let author = data.author;
            let authorId = data.authorId;
            let authorImage = data.authorImage;
            let postsContainer = document.getElementById("posts");
            let cardContainer = document.createElement("div");
            let cardText = document.createElement("p");
            let cardAuthor = document.createElement("a");
            let cardAuthorImage = document.createElement("img");

            classes.forEach(obj => cardContainer.classList.add(obj));
            postTextClasses.forEach(obj => cardText.classList.add(obj));
            authorNameClasses.forEach(obj => cardAuthor.classList.add(obj));

            cardAuthorImage.src = authorImage;
            cardAuthor.innerHTML = `<br>${author}`;
            cardAuthor.href = `/user/${authorId}`;
            cardText.innerText = text;
            cardAuthorImage.classList.add("image-rounded");
            cardContainer.appendChild(cardAuthorImage);
            cardContainer.appendChild(cardAuthor);
            cardContainer.appendChild(cardText);
            postsContainer.appendChild(cardContainer);
            postText.value = "";
        })
        .catch(e => {
            console.log(e);
        });
}

window.addEventListener("load", fetchPosts);
postButton.addEventListener("click", createPost);