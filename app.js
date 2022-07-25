const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require('path');


const connectionString = "mongodb+srv://rohan123:dlmddlmdmongodb@cluster0.ydurd.mongodb.net/PostsDB?retryWrites=true&w=majority"
const connectDB = ()=>{mongoose.connect(connectionString)}
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





app.get('/home',function(req,res){
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
app.route('/compose')
    .get((req,res)=>{
        res.render('compose',{pageTitle:"Compose the blog"})
    })

    .post((req,res)=>{
        const newPost = new postModel({
            title:req.body.inputTitle,
            blog: req.body.inputBlog
        }) 
        newPost.save();
        res.redirect("/home");
    
        
    });

app.route("/post/:post_id")
    .get((req,res)=>{
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
    .post((req,res)=>{
    
        const requestedPostID = req.params.post_id;
        postModel.findOneAndRemove({id:req.params.id},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("deletion sucessful");
        
            }
        })
        
    
    res.redirect('/home')
    });

    app.route('/post/:post_id/edit')
    .get((req,res)=>{

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

    .post((req,res)=>{
        
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
        res.redirect('/home');
    });


const PORT = process.env.PORT || 3000
const start = async ()=>{
    try {
         await connectDB();
         app.listen(PORT ,()=>console.log(`The server is running on ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start();


