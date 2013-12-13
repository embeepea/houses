var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , credentials = require('./credentials')
  ;

var databaseUrl = "test";
var collections = ["users", "houses"];
var db = require("mongojs").connect(databaseUrl, collections);

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
//var GOOGLE_CLIENT_ID = "--insert-google-client-id-here--";
//var GOOGLE_CLIENT_ID = "980276856949.apps.googleusercontent.com";
//var GOOGLE_CLIENT_SECRET = "--insert-google-client-secret-here--";
//var GOOGLE_CLIENT_SECRET = "LkgBONFmExxGR7VyExd7qg6r";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: credentials.GOOGLE_CLIENT_ID,
    clientSecret: credentials.GOOGLE_CLIENT_SECRET,
    callbackURL: credentials.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

function validate_user(user) {
  if (user && user.emails && (user.emails[0].value === 'mbp@geomtech.com'
                              || user.emails[0].value === 'andrea.fey@gmail.com'
                              || user.emails[0].value === 'jrfrimme@unca.edu'
                             )) {
      return true;
  } else {
      return false;
  }
}

var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', ensureAuthenticated, function(req, res){
  db.houses.find(function(err, houses) {
    res.render('index', { user: req.user, houses: houses });
  });
});

app.get('/add', ensureAuthenticated, function(req, res){
    res.render('add', { user: req.user });
});

app.post('/add', ensureAuthenticated, function(req, res) {
  var house = {
    "house_number": req.body.number,
    "street": req.body.street,
    "city": req.body.city,
    "zip": req.body.zip,
    "zillowlink": req.body.zillow
  };
  db.houses.save(house);
  res.redirect('/');
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/ajax/houses', ensureAuthenticated, function(req, res){
  db.houses.find(function(err, houses) {
    res.send(JSON.stringify(houses));
  });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
console.log('listening');
console.log(credentials.PORT_NUMBER);
app.listen(credentials.PORT_NUMBER);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && validate_user(req.user)) {
      return next();
  }
  res.redirect('/login');
}
