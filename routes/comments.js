
var express				=require("express");
var router 				=express.Router();
var Campground			=require("../models/campground"),
    Comment				=require("../models/comment");
var middleware			=require("../middleware");
// ====================
// COMMENTS ROUTES
// ====================

router.get("/campground/:id/comments/new",middleware.isloggedin,function(req,res){
	 Campground.findById(req.params.id,function(err,campground){
		 if(err)
			  {
				  console.log(err);
			  }
		 else 
			 {
				 res.render("comment/new",{camp:campground});
			 }
	 })
	
});

router.post("/campground/:id/comments",middleware.isloggedin, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campground");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			    comment.author.id=req.user._id;
			   comment.author.username=req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
			   req.flash("success","comment added!!");
               res.redirect('/campground/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
// comment edit..
router.get("/campground/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	 Comment.findById(req.params.comment_id,function(err,foundcomment){
		 if(err)
			  {
				  res.redirect("back");
			  }
		 else 
			 {
				 res.render("comment/edit",{camp_id:req.params.id,comment:foundcomment});
			 }
	 });
	
});
//comment update
router.put("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
         Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatecomment){
			 if(err)
				  {
					  res.redirect("back");
				  }else {
				    res.redirect("/campground/"+req.params.id); 
			   }
		 });
	
});
router.delete("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
			 {
				 res.redirect("back");
			 }
		else{
			 res.redirect("/campground/"+req.params.id); 
		}
	});
});
//middleware


module.exports=router;