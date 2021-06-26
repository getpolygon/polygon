const Express = require("express");
const models = require("../../models");

const SearchAPIController = {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response}
   */
  query: async (req, res) => {
    const { q } = req.query;

    if (!q) return res.status(400).send();
    else {
      const posts = await models.PostSchema.find(
        { $text: { $search: q } },
        {
          __v:          0,
          // hearts:       0,
          private:      0,
          comments:     0,
          // createdAt:    0,
          updatedAt:    0,
          // attachments:  0,
        }
      )
        .where("private")
        .equals(false)
        .where("author")
        .ne(req.user.id);

      const accounts = await models.AccountSchema.find(
        {
          $text: { $search: q },
        },
        {
          __v:            0,
          email:          0,
          posts:          0,
          private:        0,
          friends:        0,
          password:       0,
          createdAt:      0,
          updatedAt:      0,
          notifications:  0,
        }
      )
        .where("_id")
        .ne(req.user.id);

      return res.json({ posts, accounts });
    }
  },
};

module.exports = SearchAPIController;
