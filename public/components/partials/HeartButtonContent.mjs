class HeartButtonContent {
  build(label, heartCount, active) {
    function checkActive() {
      if (active) return `<i class="fas fa-heart text-danger"></i>`;
      else return `<i class="far fa-heart text-danger"></i>`;
    }
    return `
          ${checkActive()}
          ${label}
          <span class="badge rounded-pill bg-danger love-count">${heartCount}</span>
        `;
  }
}

export default HeartButtonContent;
