var express = require('express'),
	ejs = require('ejs'),
	request = require('request'),
	path = require('path'),
	 bodyParser = require('body-parser');
	nodemailer = require('nodemailer');
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	exphbs = require('express-handlebars'),
	passport = require("passport"),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user"),
	app = express()

mongoose.connect("mongodb://localhost:27017/yoddhasWebsite", {useNewUrlParser: true});

app.use(require("express-session")({
	secret: "Yoddhas is an ngo fighting against cancer",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressSanitizer());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('handlebars',exphbs());
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'vendor')));
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);



app.get('/', function(req, res){
	res.render("index");
});

app.get('/about', function(req,res){
	res.render("about");
});
app.get('/contact', function(req,res){
	res.render("contact");
});
// Volunteer System
// app.get('/volunteer/home', function(req,res){
// 	res.render("volunteer");
// });
app.get("/login", function(req,res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
		successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req,res){
});	

app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/"); 
        });
    });
});

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});
// Support
app.get('/donate', function(req,res){
	res.render("donate");
});
// News and Events
// app.get('/events/upcomingevents', function(req,res){  
// 	res.render("upcomingevents");
// });
// app.get('/events/newsandpublications', function(req,res){  
// 	res.render("newsandpublications");
// });
// // Healthy Living
// app.get('/healthyliving/blog', function(req,res){  
// 	res.render("blog");
// });
// app.get('/healthyliving/hospital', function(req,res){  
// 	res.render("hospital");
// });

// // Dealing with Cancer
// app.get('/dealingwithcancer/dosanddonts', function(req,res){  
// 	res.render("dosanddonts");
// });
// app.get('/dealingwithcancer/basiccancer', function(req,res){  
// 	res.render("basiccancer");
// });
// app.get('/dealingwithcancer/multiplemyeloma', function(req,res){  
// 	res.render("multiplemyeloma");
// });
// app.get('/dealingwithcancer/bonemarrowdonor', function(req,res){  
// 	res.render("bonemarrowdonor");
// });
// app.get('/dealingwithcancer/inspirations', function(req,res){  
// 	res.render("inspirations");
// });
// app.get('/dealingwithcancer/faq', function(req,res){  
// 	res.render("faq");
// });

//blog
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
      if(err){
          console.log("ERROR!");
      } else {
         res.render("blogIndex", {blogs: blogs}); 
      }
  });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.post('/send',(req,res) => {
  // async..await is not allowed in global scope, must use a wrapper
async function main(){

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'yoddhascontact@gmail.com', // generated ethereal user
      pass: 'Yoddhas@99' // generated ethereal password
    },
    tls:{
    	rejectUnauthorized:false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Yoddhas Contact" <yoddhascontact@gmail.com>', // sender address
    to: "Team@yoddhas.com,rashimandla@gmail.com", // list of receivers
     subject: `${req.body.name}`,
    replyTo: `${req.body.email}`,
    html:`<p>You have new contact request from Yoddhas Web</p><h3>Contact Detail</h3><ul><li>Name : ${req.body.name}</li><li>Email : ${req.body.email}</li><li>Subject : ${req.body.subject}</li></ul><h3>Message</h3>${req.body.message}`,
  });
 
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com
  res.render('contact');
   res.end();

	}
	main().catch(console.error);
});

app.listen(3000,(req,res) => {
	console.log('App on 3000');
});
