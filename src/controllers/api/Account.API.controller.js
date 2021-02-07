const jwt = require("jsonwebtoken");
const omit = require("../../utils/omit");
const MinIO = require("../../utils/minio");
const AccountSchema = require("../../models/account");

exports.fetchAccount = async (req, res) => {
  const { accountId } = req.query;
  const { jwt: token } = req.cookies;

  if (token && !accountId) {
    // Filter for current account
    const Exclude = ["password"];

    return jwt.verify(token, process.env.JWT_Token, async (error, data) => {
      if (error) {
        return res.json(403).json({
          error: error
        });
      } else if (data) {
        const foundAccount = await AccountSchema.findById(data.id);
        const payload = omit(foundAccount, Exclude);
        return res.status(200).json(payload);
      }
    });
  } else if (accountId) {
    // Filter for other accounts
    const Exclude = ["password", "email"];

    const foundAccount = await AccountSchema.findById(accountId);
    const payload = omit(foundAccount, Exclude);
    return res.status(200).json(payload);
  } else {
    return res.json({
      error: "Forbidden"
    });
  }
};

exports.deleteAccount = async (req, res) => {
  // For deleting the account

  const { jwt: token } = req.cookies;
  const { JWT_TOKEN } = process.env;

  jwt.verify(token, JWT_TOKEN, async (err, data) => {
    if (err) {
      return res.json({
        error: "Forbidden"
      });
    } else if (data) {
      try {
        const ObjectStream = MinIO.client.listObjectsV2(MinIO.bucket, data.id + "/", true);
        const _FILES_ = [];

        try {
          // Deleteing the account from MongoDB
          await AccountSchema.findByIdAndDelete(data.id);

          // Deleting all the uploads
          ObjectStream.on("data", (obj) => _FILES_.push(obj.name));
          ObjectStream.on("end", async () => {
            await MinIO.client.removeObjects(MinIO.bucket, _FILES_);
          });
        } catch (error) {
          console.error(error);
        }

        return res.clearCookie("jwt").json({
          message: "Deleted"
        });
      } catch (error) {
        console.error(error);
        return res.json({
          error: error
        });
      }
    }
  });
};

exports.updateAccount = async (req, res) => {
  // TODO: Needs implementation
};

exports.getRandomAccounts = async (req, res) => {
  const { jwt: token } = req.cookies;
  jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
    if (err) return res.status(500).json({ error: err });
    else if (data) {
      const RandomAccounts = await AccountSchema.find().where("_id").ne(data.id).limit(10);
      return res.json(RandomAccounts);
    }
  });
};
