var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2.引入文件上传模块：multer
var multer = require('multer');
// dest:目的，文件上传之后的存储目录
// 上传文件的文件域name值必须是img
app.use(multer({ dest: 'public/uploads' }).single('img'));

// 3.使用session来登录注册
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    name: "shop_id", // 设置cookie中保存session_id的字段名称
    secret: 'shop', // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30, secure: false }, //过期时间，过期后 cookie 中的 session id 自动删除
    store: new MongoStore({ url: "mongodb://localhost:27017/jianxia" }),
    resave: false,
    saveUninitialized: true
}));

// 4.增加消息提示（依赖session）
var flash = require('connect-flash');
app.use(flash());


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
