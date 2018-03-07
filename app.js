var express                 = require("express"),
    app                     = express(),
    Campground              = require("./models/campground"),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seeds"),
    passport                = require("passport"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    localStratergy          = require("passport-local"),
    User                    = require("./models/user"),
    methodOverride          = require("method-override");
  
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_final");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//passport config
app.use(require("express-session")({
    secret: "Best framework ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

app.use(indexRoutes);
app.use("/campground/:id/comments", commentRoutes);
app.use("/campground", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Yelp Camp Server HAS STARTED!");
});