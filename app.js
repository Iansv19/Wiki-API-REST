const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articlesSchema);

app.route("/articles")
.get(function(req, resp){
  Article.find({},function(err,foundArticles){
    if(!err){
      resp.send(foundArticles);
    } else{
      resp.send(err);
    }
  });
})
.post(function(req,resp){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      resp.send("Successfully added a new article");
    }else {
      resp.send(err);
    }
  });
})
.delete(function(req,resp){
  Article.deleteMany(function(err){
    if(!err){
      resp.send("Successfully deleted");
    }else{
      resp.send(err);
    }
  })
});

app.route("/articles/:articleTitle")
.get(function(req,resp){
  Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      resp.send(foundArticle);
    }else{
      resp.send("Not article found")
    }
  })
})

.put(function(req,resp){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        resp.send("Successfully updated");
      }
    }
  );
})

.patch(function(req,resp){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        resp.send("Successfully updated");
      }else{
        resp.send(err)
      }
    }
  );
})

.delete(function(req,resp){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        resp.send("Successfully deleted")
      } else {
        resp.send(err);
      }
    }
  );
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
