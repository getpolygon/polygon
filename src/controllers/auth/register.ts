import express from "express";

const register = (req: express.Request, res: express.Response) => {
  // Getting the properties from the body
  // const { firstName, lastName, email, password, username } = req.body;
  // // Rendering the email template
  // const rendered = handlebars.compile(template)({
  //   ip,
  //   token: sid,
  //   name: firstName,
  //   time: new Date(),
  //   frontendUrl: BASE_FRONTEND_URL,
  // });
  // // Sending an email for verification
  // const mail = new Mail({
  //   html: rendered,
  //   receiver: email,
  //   subject: "Polygon email verification",
  // });
  // await mail.send();
  // Creating a payload
  // const payload = {
  //   email,
  //   username,
  //   lastName,
  //   firstName,
  //   password: bcrypt.hashSync(
  //     password,
  //     bcrypt.genSaltSync(Math.floor(Math.random()))
  //   ),
  // };
  // // Setting a random key with initial, stringified values for email verification
  // redis.set(sid, JSON.stringify(payload), (error, _) => {
  //   if (error) return res.status(500).json();
  //   else {
  //     redis.expire(sid, 60 * 5, (error, _) => {
  //       if (error) return res.status(500).json();
  //       // Only sending the sid of the verification token in development
  //       else return res.status(204).json(isDev && sid);
  //     });
  //   }
  // });
};

export default register;
