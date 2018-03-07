var Campground =require("../models/campground");
var Comment = require("../models/comment")
var middlewareObj = {};
middlewareObj.campgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            //if user is logged in  
             Campground.findById(req.params.id, function(err, foundCamp){
                if(err){
                    req.flash("error","Campground not found.");
                    res.redirect("back");
                }else{
                    //does the user own the campground
                    if(foundCamp.author.id.equals(req.user._id) ){
                        next();
                    } else{
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                    
                }
            });
         } else{
             req.flash("error","You need to be logged in to do that.");
             res.redirect("back");
         }
};

middlewareObj.checkCommentOwnership = function(req, res, next){ 
        if(req.isAuthenticated()){
            //if user is logged in  
             Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error","Something went wrong.");
                    res.redirect("back");
                }else{
                    //does the user own the campground
                    if(foundComment.author.id.equals(req.user._id) ){
                        next();
                    } else{
                        req.flash("error","You don't have permission to do that.");
                        res.redirect("back");
                    }
                    
                }
            });
         } else{
             req.flash("error","You need to be logged in to do that.");
             res.redirect("back");
         }
    
};

middlewareObj.isLoggedIn = function(req, res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};
module.exports = middlewareObj;