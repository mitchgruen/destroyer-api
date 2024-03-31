const requestLogger = (req, res, next) => {
  console.log('Request Received!');
  console.log(req.method, req.url);
  next();
};

module.exports = requestLogger;
