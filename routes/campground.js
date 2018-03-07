var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    Campground.find({} , function(err, allCampgrounds){
        if(err){
        console.log(err);
    }else{
        res.render("campgrounds/index", {campground: allCampgrounds});
    }
    });
    
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name= req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name,price:price, image: image, description: desc, author: author};
    //create a new entry in db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campground");
        }
    });
    // campground.push(newCampground);
    
    
});

router.get("/new", middleware.isLoggedIn,  function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
    
});

//Edit route
router.get("/:id/edit", middleware.campgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                req.flash("error","Campground not found.");
                res.redirect("/campground");
            }
            
            res.render("campgrounds/edit", {campground: foundCamp});
        });
});
//update route
router.put("/:id",middleware.campgroundOwnership, function(req, res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campground");
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    } );    
});

//destroy route
router.delete("/:id",middleware.campgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error","Campground not found.");
            res.redirect("/campground");
        } else{
            res.redirect("/campground");
        }
    });
});







module.exports = router;