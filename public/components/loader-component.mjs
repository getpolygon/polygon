class Loader {
  constructor({ fullScreen }) {
    if (fullScreen == true) {
      let loader = document.createElement("div");
      loader.classList.add("full-loader-default");
      loader.classList.add("full-loader");
      loader.classList.add("is-active");
      loader.id = "loader-full";
      return loader;
    } else {
      let container = document.createElement("div");
      let loader = document.createElement("div");
      container.style.paddingBottom = "40px";
      loader.classList.add("spinner-border");
      loader.classList.add("text-primary");
      container.style.textAlign = "center";
      container.id = "loader";
      container.appendChild(loader);
      return container;
    }
  }
}

export default Loader;
