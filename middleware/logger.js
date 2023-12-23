const log = (req, res, next) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  console.log(`${req.method} - ${req.originalUrl} : ${currentDate} : ${currentTime}`);
  next();
};

module.exports = log;
