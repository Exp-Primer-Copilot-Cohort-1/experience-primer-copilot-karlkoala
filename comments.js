// Create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var db = mongoose.connection;
var url = 'mongodb://localhost:27017/comments';
var ObjectId = require('mongodb').ObjectID;

// Connect to db
mongoose.connect(url, { useMongoClient: true });

// Create schema
var commentSchema = new Schema({
  id: ObjectId,
  name: String,
  comment: String
});

// Create model
var Comment = mongoose.model('Comment', commentSchema);

// Set view engine
app.set('views', './views');
app.set('view engine', 'pug');

// Set static files
app.use(express.static(path.join(__dirname, 'public')));

// Set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

// Set routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/comments', function(req, res) {
  Comment.find(function(err, comments) {
    if (err) return console.error(err);
    res.render('comments', { comments: comments });
  });
});

app.post('/comments', function(req, res) {
  var comment = new Comment({
    name: req.body.name,
    comment: req.body.comment
  });
  comment.save(function(err, comment) {
    if (err) return console.error(err);
    console.log('Comment saved');
  });
  res.redirect('/comments');
});

app.get('/comments/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) return console.error(err);
    res.render('comment', { comment: comment });
  });
});

app.get('/comments/:id/edit', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) return console.error(err);
    res.render('edit', { comment: comment });
  });
});

app.post('/comments/:id/update', function(req, res) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function(err, comment) {
    if (err) return console.error(err);
    res.redirect('/comments');
  });
});