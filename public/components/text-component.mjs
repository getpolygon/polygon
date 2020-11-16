class TextComponent {
  create(postId, authorImage, authorId, author, postDate, text, { readOnly }) {
    if (readOnly == false) {
      return `
            <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-2" role="button"></i>
                <img
                src="${authorImage}"
                alt="profile-photo"
                class="rounded-circle"
                width= "50"
                height="50"
                />
                <h4 class="text-dark mt-3 align-baseline">
                <a href="/user/${authorId}">${author}</a>
                </h4>
                <h6 class="text-dark align-baseline">
                ${text}
                </h6>
                <h6 class="text-secondary">${postDate}</h6>
            </div>
          `;
    } else {
      return `
        <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
            <img
            src="${authorImage}"
            alt="profile-photo"
            class="rounded-circle"
            width= "50"
            height="50"
            />
            <h4 class="text-dark mt-3 align-baseline">
            <a href="/user/${authorId}">${author}</a>
            </h4>
            <h6 class="text-dark align-baseline">
            ${text}
            </h6>
            <h6 class="text-secondary">${postDate}</h6>
        </div>
        `;
    }
  }
}

export default TextComponent;
