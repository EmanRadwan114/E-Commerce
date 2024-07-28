const globalErrHandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message, statusCode: err.statusCode });
};

export default globalErrHandler;
