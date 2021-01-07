const Notification = (notifId, senderFullName, senderAccountId) => {
  return `
    <li id=${notifId} class="list-group-item shadow-sm rounded-lg mb-2">
      <i style="float:right" type="button" class="btn-close" aria-label="Close" role="button"></i>
        <h3 align="left"><b>${senderFullName}</b> sent you a friend request</h3>
      <div align="right">
        <a href="/user/${senderAccountId}" class="btn btn-primary">
          Go to profile
        </a>
        <button class="accept btn btn-success">
          Accept Request
        </button>
        <button class="decline btn btn-danger">
          Decline Request
        </button>
      </div>
    </li>
`;
};

export default Notification;
