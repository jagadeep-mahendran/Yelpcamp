var		express				=require("express"),
		app					=express(),
		bodyParser			=require("body-parser"),
		mongoose			=require("mongoose"),
		flash				=require("connect-flash"),
		passport			=require("passport"),
		LocalStrategy		=require("passport-local"),
		methodOveride		=require("method-override"),
		User				=require("./models/users"),
		Campground			=require("./models/campground"),
		seedDB				=require("./seeds"),
		Comment				=require("./models/comment"),
        expressSession		=require("express-session");
 	
// require routes
	var commentRoutes=require("./routes/comments"),
		campgroundRoutes=require("./routes/campgrounds"),
		indexRoutes=require("./routes/index");

app.set("view engine","ejs");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOveride("_method_"));
mongoose.set("useFindAndModify", false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
 
 mongoose.connect("mongodb://localhost:27017/yelp_camp");
//mongoose.connect("mongodb+srv://Jagadeep:<12345>@yelpcamp.c9xtg.mongodb.net/<yelp_camp>?retryWrites=true&w=majority");

app.use(flash());

//seedDB();

//passport config=====
 app.use(expressSession({
	 secret:"i'm spyder",
	 resave:false,
	 saveUninitialized :false
 }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  

app.use(function(req,res,next){
	res.locals.curuser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
	
});
//use routes
  app.use(indexRoutes);
app.use(campgroundRoutes);
  app.use(commentRoutes);
  
  
app.listen(3000,function(){
	console.log("Yelpcamp Server starting...");
});