var express = require('express');
var path = require('path');
var logger = require('morgan');
var apiRouter = require('./routes/api');
var redis = require('redis');
var settings = require('./config/settings');
var client = redis.createClient({
  host: settings.redis.url,
  port: settings.redis.port,
});
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var http = require('http');
var app = express();

const slowDown = require('express-slow-down');

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

//  apply to all requests
app.use(speedLimiter);

app.use(
  session({
    secret: settings.server.cookie.encryptkey,
    // create new redis store.
    store: new redisStore({
      host: settings.redis.url,
      port: settings.redis.port,
      client: client,
      ttl: settings.server.cookie.sessionTimeout,
    }),
    cookie: {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: settings.server.cookie.maxage * 1000 * 60,
    },
    saveUninitialized: true,
    resave: false,
    rolling: true,
  })
);

app.use(
  logger(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"'
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const buildPath = path.join(__dirname, '..', 'dist');
app.use(express.static(buildPath));

app.use('/api', apiRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var httpServer = http.createServer(app);

httpServer.listen(settings.server.port, () => {
  console.log('HTTP Server running on port ' + settings.server.port);
});
