const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');


var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

mongoose.connect("mongodb+srv://rohan:dlmddlmdmongodb@cluster1.ydurd.mongodb.net/postsDB");
app.use(express.urlencoded({extended:true}));
app.use(express.static("views"));
app.set('view engine','ejs')
 
const postSchema = new mongoose.Schema({
    title:String,
    blog:String
})

const postModel = mongoose.model('post',postSchema);

const aboutText = "Lorem Ipsum is simply dummy text of the printing and typesetting  and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const contactText = "Lorem passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";





app.get('/',function(req,res){
    postModel.find((err,post)=>{
       
            res.render('index',{
                posts:post
        
            })
    })
   

})

app.get('/about',function(req,res){
    res.render('about',{pageText:aboutText,pageTitle:"About"})
})
app.get('/contact',function(req,res){
    res.render('contact',{pageText:contactText,pageTitle:"Contact"})
})
app.get('/compose',function(req,res){
    res.render('compose',{pageTitle:"Compose the blog"})
})
app.post('/compose',function(req,res){
    const newPost = new postModel({
        title:req.body.inputTitle,
        blog: req.body.inputBlog
    }) 
    newPost.save();
    res.redirect("/");
})

app.get("/:post_id",function(req,res){

    const requestedPostID = req.params.post_id;
    postModel.find((err,posts)=>{
        posts.forEach((post)=>{
            if(post.id === requestedPostID){
               res.render('posts',{
                Title:post.title,
                Blog:post.blog,
                post_id :post.id
            })
             
            }
        })
    })
 
})

app.post("/:post_id",(req,res)=>{
   
    const requestedPostID = req.params.post_id;
    postModel.findOneAndRemove({id:req.params.id},(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("deletion sucessful");
       
        }
    })
    
  
   res.redirect('/')
})

app.get('/:post_id/edit',(req,res)=>{

    postModel.find((err,posts)=>{
        posts.forEach((post)=>{
            if(req.params.post_id === post.id){
        
                res.render('edit',{
                    pageTitle:"Edit Here",
                    placeholderTitle:post.title,
                    placeholderBlog:post.blog,
                    post_id : post.id
            
                })
            }
        })
    })
})

app.post('/:post_id/edit',(req,res)=>{
    console.log(req.params.post_id);
    console.log(req.body.newTitle);
    console.log(req.body.newBlog);
    postModel.updateOne({_id:req.params.post_id},{
        blog:req.body.newBlog,
        title:req.body.newTitle,
    },(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Successfully edited');
        }
    })
    res.redirect('/');
})
const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>console.log("The server is running in port 3000"))



