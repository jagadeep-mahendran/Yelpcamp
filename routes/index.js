var express				=require("express");
var router 				=express.Router(),
	passport			=require("passport"),
	User				=require("../models/users");
router.get("/",function(req,res){
	res.render("campground/landing");
});

//Auth routes

router.get("/register",function(req,res){
	res.render("campground/register");
});
//Sigh up...
router.post("/register",function(req,res){
	
	var nwusr=new User({username:req.body.username});
	User.register(nwusr,req.body.password,function(err,user){
		if(err)
			 {
				 console.log(err);
				 return res.render("campground/register");
			 }
		passport.authenticate("local")(req,res,function(){
			req.flash("success","welcome to yelpcamp  "+user.username);
			res.redirect("/campground");
		});
	});
});

//logging in

router.get("/login",function(req,res){
	res.render("campground/login");
});
router.post("/login",passport.authenticate("local",{
	     successRedirect: "/campground",
         failureRedirect: "/login"
	 }),function(req,res){
		 //res.send("logged in");
		 });

//log out....
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campground");
});


module.exports=router;