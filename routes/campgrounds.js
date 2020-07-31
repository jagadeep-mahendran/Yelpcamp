var express				=require("express");
var router 				=express.Router();
var Campground			=require("../models/campground"),
	Comment				=require("../models/comment");
var middleware			=require("../middleware");
router.get("/campground",function(req,res){
	    
	Campground.find({},function(err,allcamp){
		if(err)
			 {
				 console.log(err);
			 }
		else 
			{
				res.render("campground/campground",{data:allcamp});
			}
	});
	//res.render("campground",{data:campgrounds});
});
 
router.post("/campground",middleware.isloggedin,function(req,res){
	  var name=req.body.name;
	var img=req.body.img;
	var des=req.body.des;
	var author= {
		id:req.user._id,
		username:req.user.username
	}
	var ob={name:name,img:img,des:des,author:author};
	 Campground.create(
			ob
		   ,function(err,campground){
			 if(err)
				  {
					  console.log(err);
				  }
			else{
				console.log("New created");
				console.log(campground);
				res.redirect("/campground");
			}
});
	
});
router.get("/campground/new",middleware.isloggedin,function(req,res){
	 res.render("campground/new");
});
//show
router.get("/campground/:id",function(req,res){
	 Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		 if(err){
			 console.log(err);
		 }
		 else 
			 {
				 res.render("campground/show",{data:foundcamp});
			 }
	 });
});
//edit camp PUT
router.get("/campground/:id/edit",middleware.checkowner,function(req,res){
	   
			 
			Campground.findById(req.params.id,function(err,data){
					 
						 res.render("campground/edit",{data:data});
						 
				 });	  
});

router.put("/campground/:id",middleware.checkowner,function(req,res){
	 
	Campground.findByIdAndUpdate(req.params.id,req.body.data,function(err,data){
		if(err)
			 {
				 console.log(err);
				 res.redirect("/campground");
			 }
		else 
			{
				res.redirect("/campground/"+req.params.id);
			}
	});
});
// DESTROY CAMPGROUND ROUTE
router.delete("/campground/:id", middleware.checkowner,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campground");
      } else {
          res.redirect("/campground");
      }
   });
});

  module.exports=router;