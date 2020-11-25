self.addEventListener("fetch", function (event) {
  // do nothing here, just log all the network requests
  console.log(event.request.url);
});
