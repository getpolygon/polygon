const models = require("../../models");

const SearchAPIController = {
  query: async (req, res) => {
    const { q } = req.query;

    if (!q) return res.status(400).send();
    else {
      /**
       * TODO: Update search indexes to improve privacy including:
       * * Don't allow finding a user by their email
       * * Don't allow finding a user by their password hash
       * * Don't allow finding a user by their friend connections
       *
       * ? Documentation on indexes from mongoose: https://mongoosejs.com/docs/guide.html#indexes
       */
      const posts = await models.PostSchema.find({ $text: { $search: q } })
        .where("private")
        .ne(true)
        .where("author")
        .ne(req.user.id);

      const accounts = await models.AccountSchema.find(
        {
          $text: { $search: q },
        },
        {
          email: 0,
          password: 0,
          notifications: 0,
          friends: 0,
          posts: 0,
          timestamp: 0,
        }
      )
        .where("private")
        .ne(true)
        .where("_id")
        .ne(req.user.id);

      return res.json({ posts, accounts });
    }
  },
};

module.exports = SearchAPIController;
