class HeartButtonContent {
  build(label, heartCount, active) {
    return `
          ${
            active
              ? `<i class="far fa-heart text-danger"></i>`
              : `<i class="far fa-heart text-danger"></i>`
          }
          
          ${label}
          <span class="badge badge-pill badge-danger love-count">${heartCount}</span>
        `;
  }
}

export default HeartButtonContent;
