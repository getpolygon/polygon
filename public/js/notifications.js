import Notification from "/components/notification-component.mjs";
const notificationContainer = document.getElementById("notifications");

function fetchNotifications() {
  const msg = document.createElement("div");
  fetch("/api/notifications/fetch")
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
          notificationCreated.innerHTML = Notification(
            notification._id,
            notification.fullName,
            notification.accountId
          );
          notificationContainer.prepend(notificationCreated);
          const closeButton = notificationCreated.querySelector(".btn-close");
          const acceptFriendRequestButton = notificationCreated.querySelector(".accept");
          const declineFriendRequestButton = notificationCreated.querySelector(".decline");

          acceptFriendRequestButton.addEventListener("click", () =>
            acceptFriendRequest(notification.accountId, notificationCreated)
          );
          closeButton.addEventListener("click", () =>
            declineFriendRequest(notification.accountId, notificationCreated)
          );
          declineFriendRequestButton.addEventListener("click", () =>
            declineFriendRequest(notification.accountId, notificationCreated)
          );
        });
      }
    })
    .catch((e) => console.error(e));
}

const declineFriendRequest = (accountId, element) => {
  fetch(`/api/friends/update/?accountId=${accountId}&decline=true`, {
    method: "PUT"
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status === "OK") {
        element.innerHTML = "";
      }
    })
    .catch((e) => console.error(e));
};

const acceptFriendRequest = (accountId, element) => {
  fetch(`/api/friends/update/?accountId=${accountId}&accept=true`, {
    method: "PUT"
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status === "OK") {
        element.innerHTML = "";
      }
    })
    .catch((err) => console.error(err));
};

window.addEventListener("load", fetchNotifications);
