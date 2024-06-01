require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs');
const PORT = 3000;
const mongoose = require('mongoose')
const axios = require('axios')
const bcrypt = require('bcrypt')
const multer = require('multer')
const cloudinary = require('cloudinary');
const datauri = require('datauri')
app.set('view engine','hbs');
hbs.registerPartials(__dirname+"/views/partials");
app.use(express.static(path.join(__dirname,"Public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const session = require('express-session');
const MongoStore = require('connect-mongo');
const saltRounds = 10;

app.use(session({
    secret: 'asbdbakhhk bwbdwbdbwqkhvedwqvedvqwvdwq dvqwjhwqvejqwvejwqvje',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))
const github_token = process.env.GITHUB_TOKEN;

const User = require('./models/user');

const passport = require('./authentication/passport');
app.use(passport.initialize());
app.use(passport.session());


// const upload = multer({ dest: 'profile_images/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/profile_images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = req.user._id;
      cb(null,uniqueSuffix + path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

  
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{

    let {message} = req.params;
    // console.log(req);
    // console.log(req.body);
    // console.log(req.params);
    res.render('login',{
        message
    });
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/dashboard',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('dashboard',{
            profile:req.user
        });
    }
    else{
        res.redirect('/login');
    }
   
})

app.get('/dashboard/:username',async (req,res)=>{
    let {username} = req.params;
    let user_data;
    try {
        const config = {
            headers: {
                Authorization: `token ${github_token}` 
            }
        };
        // Make the request using axios with the configured headers
        user_data = await axios.get(`https://api.github.com/users/${username}`, config);
        user_repos = await axios.get(`https://api.github.com/users/${username}/repos`, config);
        user_repos = user_repos.data.map(repo=>repo.name);
        user_data = user_data.data;
    } catch (err) {
        console.log(err);
    }


    res.render('user',{
        user_data:user_data,
        user_repos:user_repos
    });
})

app.get('/dashboard/:username/:repo_name',async (req,res)=>{
    let {username,repo_name} = req.params;
    try {
        const config = {
            headers: {
                Authorization: `token ${github_token}` 
            }
        };
        // Make the request using axios with the configured headers
        let {data} = await axios.get(`https://api.github.com/repos/${username}/${repo_name}`, config);
        let repo_data = data;
        console.log(data);
        res.render('repo',{
            repo_data:repo_data
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

app.post('/register' ,async (req,res)=>{
    let {username,password,email,dob} = req.body;
    // res.send({username,password,email,dob});
    try {
        // Hash the password
        const hash = await bcrypt.hash(password, saltRounds);
        
        // Create the user in the database
        await User.create({ username, dob, email, password: hash });

        // Encode success message and redirect to login page
        const message = encodeURIComponent('User Created Successfully.');
        res.redirect(`/login?message=${message}`);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error during registration:', error);

        // Encode error message and redirect to registration page
        const message = encodeURIComponent('Error creating user. Please try again.');
        res.redirect(`/register?message=${message}`);
    }
    


});

app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword');
})      


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

  
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
});


app.post("/get_user_from_username",async (req,res)=>{
    let {username} = req.body;
    let user_details  = await User.findOne({username});
    res.send(user_details);
})

app.post("/get_user_from_email",async (req,res)=>{
    let {email} = req.body;
    let user_details  = await User.findOne({email});
    res.send(user_details);
})

const otp = require('./controllers/sendOtp');
let o;
app.post("/send_otp",async (req,res)=>{
    let {email} = req.body;
    otp.sendOtp(email).then((otp) => {
        // Save the OTP wherever you need it
        console.log('OTP sent:', otp);
        o=otp;
        res.send("email sended");
    })
    .catch((error) => {
        console.error('Error sending OTP:', error);
        res.send(error);
    });
});
app.post("/check_otp",async (req,res)=>{
    let {otp} = req.body;
    if(o == otp){
        res.send(true);
    }
    else{
        res.send(false);
    }
});

app.post("/change_password",(req,res)=>{
    
    let {otp,password,forgot_user} = req.body;
    try {
        // Verify OTP
        if (otp == o) {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    console.error("Error hashing password:", err);
                    res.send(false);
                    return;
                }
                // Update user's password
                try {
                    await User.findByIdAndUpdate(forgot_user._id, { password: hash });
                    console.log("Password updated successfully.");
                    res.send(true);
                } catch (error) {
                    console.error("Error updating password:", error);
                    res.send(false);
                }
            });
        } else {
            // If OTP doesn't match
            console.log("Invalid OTP.");
            res.send(false); 
        }
    } catch (error) {
        console.error("Error:", error);
        res.send(false);
    }
})

app.post("/change_profile",upload.single('file') ,async (req,res)=>{
    console.log(req.file);
    try {
        let cloudinary_image_url;
        let image_data_uri;
        await cloudinary.v2.uploader.upload(req.file.path,(error, result)=>{
            console.log(result, error);
            cloudinary_image_url = result.url;
        });
        await datauri(req.file.path,(err,content,meta)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(content);
                image_data_uri = content;
            }
        })
        // console.log(image_data_uri)
        await User.findByIdAndUpdate(req.user._id,{image:req.file.path,cloudinary_image_url,image_data_uri});

        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
    }
  
})

mongoose.connect(process.env.MONGO_URL)
    .then(async ()=>{
        app.listen(PORT);
    })
    .catch(err=>console.log(err));

