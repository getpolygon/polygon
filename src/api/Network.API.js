const jwt = require("jsonwebtoken");
const _ = require("lodash");
const router = require("express").Router();

let active_users = [];

router.ws("/", (ws, req) => {
  ws.on("message", () => {
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
      if (err) return ws.send("Error");
      else if (data) {
        if (active_users.includes(data.id)) {
          return ws.send("");
        } else {
          return active_users.push(data.id);
        }
      }
    });
  });

  ws.on("close", () => {
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
      if (err) return ws.send("Error");
      else if (data) {
        return _.remove(active_users, req.cookies.jwt);
      }
    });
  });
});

router.get("/active", async (req, res) => {
  const { accountId } = req.query;
  if (_.includes(active_users, accountId.toString())) {
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
