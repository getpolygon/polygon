const logoutForm = document.getElementById("logout");
const logoutButton = document.getElementById("submitLogout");
const searchBox = document.getElementById("search");
const fullName = document.querySelector(".nav-account-name");

// This is to add 3 dots if the full name has 10+ characters
const trimmed_full_name = (str, speclength) => {
  if (str.length > speclength) return `${str.slice(0, speclength)}...`;
  else return str;
};

fullName.innerHTML = trimmed_full_name(fullName.innerHTML, 10);

function search() {
  fetch(`/api/search/?query=${searchBox.value}`)
    .then((doc) => doc.json())
    .then((doc) => {
      const foundItemsContainer = document.getElementById("foundItems");
      if (searchBox.value == "") {
        foundItemsContainer.innerHTML = "";
      } else {
        doc.forEach((result) => {
          const dupl = document.getElementById(result._id);
          if (!dupl) {
            const el = document.createElement("a");
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
