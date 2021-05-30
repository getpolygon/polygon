const SearchAPIController = {
  query: async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).send();
    else {
      // TODO
      const results = [];
      return res.json(results);
    }
  },
};

module.exports = SearchAPIController;
