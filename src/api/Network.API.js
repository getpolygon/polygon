const ActiveUsers = [];
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.ws("/", (ws, req) => {
  ws.on("open", () => {
    return ws.send(JSON.stringify({ message: "Successfully connected to Usocial network" }));
  });

  ws.on("message", (message) => {
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
      if (err) return ws.send({ message: "error" });
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
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
      if (err) return ws.send("Error");
      else if (data) {
        return _.remove(ActiveUsers, req.cookies.jwt);
      }
    });
  });
});

router.get("/active", async (req, res) => {
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
});

module.exports = router;
