class Loader {
  constructor({ fullScreen }) {
    if (fullScreen === true) {
      let loader = document.createElement("div");
      loader.classList.add("full-loader-default");
      loader.classList.add("full-loader");
      loader.classList.add("is-active");
      loader.id = "loader-full";
      return loader;
    } else {
      let loader = document.createElement("div");
      loader.id = "loader";
      loader.classList.add("d-flex");
      loader.classList.add("justify-content-center");
      loader.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
      `;
      return loader;
    }
  }
}

export default Loader;
