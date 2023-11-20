const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const SQLiteStore = require('connect-sqlite3')(session);
const logger = require('morgan');
const flash = require('connect-flash');
const { sequelize } = require('./models/index')
const config = require('./config/config')
const bodyParser = require('body-parser');
const PgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg')
const pgPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sessions',
  password: 'root',
  port: process.env.PORT || 5432,
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/assets', express.static('assets'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new PgSession({
      pool: pgPool,  
      tableName: 'sessions',  
  }),
  secret: 'qwjh234128wlekjr12l3kjh1',
  resave: false,
  saveUninitialized: false,
}));

app.use(session({
    secret: 'qwjh234128wlekjr12l3kjh1',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: 'database' }),
    //cookie: { secure: true, sameSite: 'None'}
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app)

app.use(function(req, res, next) {
    res.locals.msg = {error: 404, desc: 'The page you requested could not be found.'};
    res.status(404);
    res.render('error', { title: '404 Error' });
});
app.use(function(err, req, res, next) {
    res.locals.msg = {error: 500, desc: 'Sorry, there is some internal problems.'};
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
    res.status(500);
    res.render('error', { title: '500 Error' });
});

const db = require('./models'); // Путь к вашему файлу с моделями

db.sequelize.sync()
  .then(() => {
    console.log('Таблицы синхронизированы');
    app.listen(config.port, () => {
      console.log(`Server started on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка синхронизации:', error);
  });