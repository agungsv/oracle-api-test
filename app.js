const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');

const rInventoryItem = require('./routes/inventory_items');

let app = express();

if(process.env.NODE_ENV === 'Production'){
  logger.token('body', (req, res) => JSON.stringify(req.body));
  app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" req-body :body :status :response-time ms :res[content-length]'));
}else{
  app.use(logger('dev'));
}
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/inventory-items', rInventoryItem);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    data: null,
    message: err.message,
  });
});

module.exports = app;
