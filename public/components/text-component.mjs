import Footer from "/components/partials/Footer.mjs";

class TextComponent {
  create(postId, authorImage, authorId, author, postDate, text, { readOnly }) {
    if (readOnly == false) {
      return `
            <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-3 pl-3 pb-2 pt-3 bg-white">
                <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-1" role="button"></i>
                <div class="d-flex post-account-component-container mb-2">
                 <img
                 src="${authorImage}"
                 alt="profile-photo"
                 class="rounded-circle shadow-sm profile-photo"
                 width= "50"
                 height="50"
                 />
                 <a class="ml-2" href="/user/${authorId}">${author}</a>
                </div>
                <h6 class="pt-2 text-dark align-baseline">
                ${text}
                </h6>
                <span class="text-secondary">${postDate}</span>
                ${new Footer().build(postId)}
            </div>
          `;
    } else {
      return `
      <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-3 pl-3 pb-2 pt-3 bg-white">
        <div class="d-flex post-account-component-container mb-2">
          <img
          src="${authorImage}"
          alt="profile-photo"
          class="rounded-circle shadow-sm profile-photo"
          width= "50"
          height="50"
          />
          <a class="ml-2" href="/user/${authorId}">${author}</a>
        </div>
        <h6 class="pt-2 text-dark align-baseline">
          ${text}
        </h6>
        <span class="text-secondary">${postDate}</span>
        ${new Footer(postId)}
        </div>
        `;
    }
  }
}

export default TextComponent;
