class Alert {
  create(text, { type }) {
    if (type === "success") {
      return `
        <div class="alert alert-success" role="alert">
            ${text}
        </div>
        `;
    }
    if (type === "danger") {
      return `
        <div class="alert alert-danger" role="alert">
            ${text}
        </div>
        `;
    } else {
      return `
        <div class="alert alert-primary" role="alert">
            ${text}
        </div>
    `;
    }
  }
}

export default Alert;
