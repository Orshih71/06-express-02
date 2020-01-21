const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');

const studentRouter = require('./routes/student');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(logger('dev'));
app.use(logger('common', {
	stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
app.use(express.json());
app.use("/picture/", express.static("public/images"));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/student', function (req, res, next) {
// 	if(req.method === "POST") {
// 		const {id, name, course, grade} = req.body;
// 		console.log(req);
// 		if (id && name && course && grade) return next();
// 		else return next("Data error");
// 	}
// });
// routing
app.use('/student', studentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.send(err);
});

module.exports = app;
