function loader() {
  let loaderContainer = document.createElement("h3");
  let loader = document.createElement("div");
  loaderContainer.id = "loader";
  loaderContainer.setAttribute("align", "center");
  loader.classList.add("three-quarters-loader");
  loaderContainer.prepend(loader);
  document.getElementById("posts").prepend(loaderContainer);
}
