const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")
const expressLayouts = require("express-ejs-layouts")
const compression = require("compression")
const helmet = require("helmet")
const limiter = require("express-rate-limit")

mongoose.set("strictQuery",false)
const mongoDBdev = "mongodb+srv://wolfxela:Idontlikefoxes@cluster0.jaetlnh.mongodb.net/local_library?retryWrites=true&w=majority"
const mainDB = process.env.DB || mongoDBdev

const catalogRouter = require('./routes/catalog')

const app = express();
const limit = new limiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
})
main().catch((err)=>{console.log(err)})

async function main(){
  await mongoose.connect(mainDB)
}

// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.use(limit())
app.use(helmet())
app.use(expressLayouts)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.redirect("/catalog")
})

app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
