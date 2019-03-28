const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const articleRoutes = express.Router();
const path = require('path');

let Article = require('./article.model');

//const MongoClient = require(‘mongodb’).MongoClient;
//const uri = "mongodb+srv://perfectsense:<password>@cluster0-hjpdb.mongodb.net/test?retryWrites=true";
//const client = new MongoClient(uri, { useNewUrlParser: true });
//client.connect(err => {
  //const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  //client.close();
//});
app.use(cors());
app.use(bodyParser.json());

// let mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/articles';
console.log(process.env.MONGODB_URI);
let mongoDB = process.env.MONGODB_URI || 'mongodb+srv://perfectsense:perfectsense@cluster0-hjpdb.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoDB);
//mongoose.Promise = global.Promise;
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//       navigator.serviceWorker.register('/service-worker.js');
//     });
// }



// app.get('/', function(req, res){
//     // res.redirect('/todo');


//  });
//app.use(express.static('client/build'));
//original route to main page
articleRoutes.route('/api/articles').get(function(req, res) {
    Article.find(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.json(articles);
        }
    });
});

//request to get article based on ID
articleRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Article.findById(id, function(err, article) {
        res.json(article);
    });
});

//Update an article based on ID, not currently in use
articleRoutes.route('/update/:id').post(function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (!article)
            res.status(404).send("data is not found");
        else
            article.article_title = req.body.article_title;
            article.article_body = req.body.article_body;
            article.article_author = req.body.article_author;
            article.article_date = req.body.article_date;
            article.article_likes = req.body.article_likes;
            article.article_comments = req.body.article_comments;

            article.save().then(todo => {
                res.json('article updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

//add an article to database
articleRoutes.route('/add').post(function(req, res) {
    let article = new Article(req.body);
    article.save()
        .then(article => {
            res.status(200).json({'article': 'article added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new article failed');
        });
});

//add a comment to a specific article on ID
articleRoutes.route('/addComment').post(function(req, res) {
    //construct a new comment from input
    let comment = {
        com_author: req.body.com_author,
        com_body: req.body.com_body,
        com_date: req.body.com_date,
        article_id: req.body.article_id
    }

    //find article in database with the given ID
    Article.findById(comment.article_id, function(err, article) {
        console.log(err,article);
        article.article_comments.push(comment); //push new comment to article array of comments

    
     article.save()
        .then(article => {
            console.log("save succeeded")
            res.status(200).json({article});
        })
        .catch(err => {
            console.log("save failed")
            console.log(err)
            res.status(400).send('adding new article failed');
        });

        
    });
    
});

//request to delete an article based on ID
articleRoutes.route('/delete:id').delete(function(req, res) {
    let id = req.params.id;
    Article.findById(id, function(err, article) {
        article.remove()
            .then(article => {
                res.status(200).json({'article': 'article removed successfully'});
            })
            .catch(err => {
                res.status(400).send('removing article failed');
            });
    });
});


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }



//app.use('/articles', articleRoutes);
//app.use(express.static('client/build'));

app.listen(process.env.PORT || PORT, function() {
    console.log("Server is running on Port: " + PORT);
});