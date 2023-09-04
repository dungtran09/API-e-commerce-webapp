module.exports = (f) => {
  return (req, res, next) => {
    f(req, res, next).catch((err) => next(err));
  };
};
