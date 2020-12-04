class Footer {
  build(postId) {
    return `
      <hr class="solid" />
      <div class="d-flex">
        <button type="button" class="btn btn-light btn-block border m-1 love-post"></button>

          <button type="button" class="btn btn-light btn-block border m-1" data-toggle="modal" data-target="#comments-${postId}">
            <i class="fas fa-comment-alt"></i>
            Comment
          </button>

          <div class="modal fade" id="comments-${postId}">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content ">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">Comments</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body comment-section-${postId}"></div>
                <div class="modal-footer">
                  <input class="form-control" type="text" placeholder="Write a comment..." />
                  <button class="btn btn-info btn-block">
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
  }
}

export default Footer;
