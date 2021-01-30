const ActiveUsers = [];
const _ = require("lodash");
const jwt = require("jsonwebtoken");

exports.onConnect = async (ws, req) => {
  ws.on("message", (message) => {
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
      if (err) return ws.send(JSON.stringify({ message: err }));
      else if (data) {
        if (JSON.parse(message).message === "ping") {
          if (ActiveUsers.includes(data.id)) return ws.send(JSON.stringify({ message: "pong" }));
          else {
            ActiveUsers.push(data.id);
            return ws.send(JSON.stringify({ message: "pong" }));
          }
        }
      }
    });
  });

  ws.on("close", () => {
    const { jwt: token } = req.cookies;
    // Close WebSocket connection safely
    const CloseConnection = () => {
      ws.send("Hi");
      jwt.verify(token, process.env.JWT_TOKEN, (err, data) => {
        if (err) return ws.send(JSON.stringify({ error: err }));
        else if (data) {
          return _.remove(ActiveUsers, data.id);
        }
      });
    };

    if (ws.readyState === 1) {
      CloseConnection();
    } else {
      ws.readyState = 1;
      CloseConnection();
    }
  });
};

exports.getActiveUsers = (req, res) => {
  const { accountId } = req.query;
  if (_.includes(ActiveUsers, accountId.toString())) {
    return res.status(200).json({
      message: true
    });
  } else {
    return res.status(200).json({
      message: false
    });
  }
};
