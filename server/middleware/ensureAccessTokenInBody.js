module.exports = function EnsureAccessTokenInBody(req, res, next) {
  if (req.body?.access_token?.length > 0) {
    next();
  } else {
    res.status(400).json("Missing access token in body");
  }
};
