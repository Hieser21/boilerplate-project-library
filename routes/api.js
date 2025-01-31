/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../model/Book')
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book.find({});
      //make a response array that only contains id, title and comment count
      let response = books.map(book => ({_id: book._id, title: book.title, commentcount: book.commentcount}));
      res.json(response)
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if (!title) return res.send("missing required field title")
      let book = await Book.create({title: title})
      //response will contain new book object including atleast _id and title
      res.json({_id: book._id, title: book.title})
    })
    
    .delete(async function(req, res){
      await Book.deleteMany();
      //if successful response will be 'complete delete successful'
      res.send("complete delete successful")
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      let book = await Book.findById(bookid).catch(err => console.log(err))
      if (!book) return res.send('no book exists')
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.json({_id: book._id, title: book.title, comments: book.comments})
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send("missing required field comment")
      let book = await Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}).catch(err => console.log(err))
      if (!book) return res.send('no book exists')
      //json res format same as .get
      res.json({_id: book._id, title: book.title, comments: book.comments})
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      let book = await Book.findByIdAndDelete(bookid).catch(err => console.log(err));
      //if successful response will be 'delete successful'
      if (!book) return res.send('no book exists')
      res.send('delete successful')
    });
  
};
