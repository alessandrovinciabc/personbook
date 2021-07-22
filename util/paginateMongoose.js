const createError = require('http-errors');

module.exports = function paginate(mongooseModel, entriesPerPage = 10) {
  if (mongooseModel == null) throw new Error('Model is undefined/null.');

  return async (req, res, next) => {
    let { page = 1 } = req.query;
    page = parseInt(page);

    if (Number.isNaN(page) || page <= 0)
      return next(createError(400, 'Invalid page number.'));

    let count = 0;
    try {
      count = await mongooseModel.countDocuments({});
    } catch (err) {
      next(err);
    }

    let docs = [];
    try {
      docs = await mongooseModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(entriesPerPage * (page - 1))
        .limit(entriesPerPage);
    } catch (err) {
      next(err);
    }

    res.json({
      docs,
      maxQuota: count,
      usersPerPage: entriesPerPage,
    });
  };
};
