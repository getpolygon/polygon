const notificationContainer = document.getElementById("notifications");

function fetchNotifications() {
  const msg = document.createElement("div");
  fetch("/api/fetchNotifications")
    .then((data) => data.json())
    .then((data) => {
      if (data.length == 0) {
        msg.innerHTML = `
                    <h5>You don't have any notifications.</h5>
                `;
        notificationContainer.prepend(msg);
      } else {
        data.forEach((notification) => {
          let notificationCreated = document.createElement("div");
          notificationCreated.innerHTML = `
                    <li id=${notification._id} class="list-group-item shadow-sm rounded-lg mb-2">
                        <i style="float:right" type="button" class="btn-close" aria-label="Close" role="button"></i>
                        <h3 align="left"><b>${notification.fullName}</b> sent you a friend request</h3>
                        <p align="right">
                            <a href="/user/${notification.accountId}" class="btn btn-primary">
                                Go to profile
                            </a>
                            <button class="accept btn btn-success">
                                Accept Request
                            </button>
                            <button class="accept btn btn-danger">
                                Decline Request
                            </button>
                        </div>
                    </li>
                    `;
          notificationContainer.prepend(notificationCreated);
          const closeButtons = document.querySelectorAll(".btn-close");
          closeButtons.forEach((button) => {
            button.addEventListener("click", closeNotificationContainer);
          });
        });
      }
    })
    .catch((e) => console.error(e));
}

function closeNotificationContainer() {
  let el = this.parentNode;
  fetch(`/api/fetchNotifications/?dismiss=true&notification=${el.id}`)
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      el.innerHTML = "";
    })
    .catch((e) => console.error(e));
}

window.addEventListener("load", fetchNotifications);
