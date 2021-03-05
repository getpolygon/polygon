const _ = require("lodash");
const jwt = require("jsonwebtoken");

const Users = {
	active: [],
	dnd: [],
	idle: []
};

exports.onConnect = async (ws, req) => {
	ws.on("open", () => {});
	ws.on("message", (message) => {
		jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, (err, data) => {
			if (err) return ws.send(JSON.stringify({ message: err }));
			else if (data) {
				const _message = JSON.parse(message);

				if (_message.message) {
					if (_message.message === "ping") {
						if (!Users.active.includes(data.id)) Users.active.push(data.id);
						return ws.send(JSON.stringify({ message: "pong" }));
					}
				} else {
					if (_message.setStatus === "active") {
						if (!Users.active.includes(data.id)) {
							Users.active.push(data.id);
							_.remove(Users.dnd, data.id);
							_.remove(Users.idle, data.id);
						}
					} else if (_message.setStatus === "idle") {
						if (!Users.idle.includes(data.id)) {
							Users.idle.push(data.id);
							_.remove(Users.active, data.id);
							_.remove(Users.dnd, data.id);
						}
					} else if (_message.setStatus === "dnd") {
						if (!Users.dnd.includes(data.id)) {
							Users.dnd.push(data.id);
							_.remove(Users.active, data.id);
							_.remove(Users.idle, data.id);
						}
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
					_.remove(Users.active, data.id);
					_.remove(Users.idle, data.id);
					_.remove(Users.dnd, data.id);
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

exports.getUserStatus = (req, res) => {
	const { accountId } = req.query;
	if (_.includes(Users.active, accountId)) {
		return res.status(200).json({
			message: "active"
		});
	} else if (_.includes(Users.dnd, accountId)) {
		return res.status(200).json({
			message: "dnd"
		});
	} else if (_.includes(Users.idle, accountId)) {
		return res.status(200).json({
			message: "idle"
		});
	} else {
		return res.json({ message: "offline" });
	}
};
