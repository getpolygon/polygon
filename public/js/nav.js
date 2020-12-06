let logoutForm = document.getElementById("logout");
let logoutButton = document.getElementById("submitLogout");
let searchBox = document.getElementById("search");

function search() {
  fetch(`/api/search/?query=${searchBox.value}`)
    .then((doc) => doc.json())
    .then((doc) => {
      let foundItemsContainer = document.getElementById("foundItems");

      if (searchBox.value == "") {
        foundItemsContainer.innerHTML = "";
      } else {
        doc.forEach((result) => {
          let dupl = document.getElementById(result._id);

          if (!dupl) {
            let el = document.createElement("a");
            // This is to add 3 dots if the full name has 10+ characters
            var trimmed_full_name = (str, speclength) => {
              if (str.length > speclength) return `${str.slice(0, speclength)}...`;
              else return str;
            };
            el.classList.add("p-3");
            el.classList.add("mt-1");
            el.classList.add("shadow-sm");
            el.style.border = "1px solid gainsboro";
            el.style.borderRadius = "10px";
            el.href = `/user/${result._id}`;
            el.id = result._id;
            el.innerHTML = `
              <img class="rounded-lg" height="32" src="${result.pictureUrl}">
              <h6>${trimmed_full_name(result.fullName, 10)}</h6>
            `;
            foundItemsContainer.appendChild(el);
          }
        });
      }
    })
    .catch((e) => console.error(e));
}

logoutButton.addEventListener("click", () => logoutForm.submit());
searchBox.addEventListener("keyup", search);
