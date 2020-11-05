module.exports = function ensureClientIdInQuery(req, res, next) {
  if (req?.query?.client_id?.length > 0) {
    next();
  } else {
    res.status(400).json("Missing 'client_id' in query");
  }
};
