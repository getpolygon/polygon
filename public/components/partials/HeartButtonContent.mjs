class HeartButtonContent {
  build(label, heartCount, active) {
    function checkActive() {
      if (active) return `<i class="fas fa-heart text-danger"></i>`;
      else return `<i class="far fa-heart text-danger"></i>`;
    }
    return `
          ${checkActive()}
          ${label}
          <span class="badge badge-pill badge-danger love-count">${heartCount}</span>
        `;
  }
}

export default HeartButtonContent;
