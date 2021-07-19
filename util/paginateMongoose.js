const createError = require('http-errors');

module.exports = function paginate(mongooseModel, entriesPerPage = 10) {
  if (mongooseModel == null) throw new Error('Model is undefined/null.');

  return (req, res, next) => {
    let { page = 1 } = req.query;
    page = parseInt(page);

    if (Number.isNaN(page) || page <= 0)
      return next(createError(400, 'Invalid page number.'));

    mongooseModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(entriesPerPage * (page - 1))
      .limit(entriesPerPage)
      .then((docs) => res.json(docs))
      .catch((err) => next(err));
  };
};
