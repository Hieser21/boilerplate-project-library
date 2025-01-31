/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'Book object should contain _id');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.equal(res.body.title, 'Test Book', 'Title should match the sent title');
            done();
          });
      });
      
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      
      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            if (res.body.length > 0) {
              assert.property(res.body[0], '_id', 'Books in array should contain _id');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            }
            done();
          });
      });
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/invalidid123')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      
      test('Test GET /api/books/[id] with valid id in db', function(done) {
        // First, create a book to test with
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for GET' })
          .end(function(err, res) {
            let bookId = res.body._id;
            
            // Now test the GET route with the created book's id
            chai.request(server)
              .get('/api/books/' + bookId)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'Book should contain _id');
                assert.property(res.body, 'title', 'Book should contain title');
                assert.property(res.body, 'comments', 'Book should contain comments array');
                assert.equal(res.body._id, bookId, 'Returned book should have the correct id');
                assert.equal(res.body.title, 'Test Book for GET', 'Returned book should have the correct title');
                assert.isArray(res.body.comments, 'Comments should be an array');
                done();
              });
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      
      test('Test POST /api/books/[id] with comment', function(done) {
        // First, create a book to test with
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Comment' })
          .end(function(err, res) {
            let bookId = res.body._id;
            
            // Now test the POST route with the created book's id
            chai.request(server)
              .post('/api/books/' + bookId)
              .send({ comment: 'This is a test comment' })
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'Book should contain _id');
                assert.property(res.body, 'title', 'Book should contain title');
                assert.property(res.body, 'comments', 'Book should contain comments array');
                assert.isArray(res.body.comments, 'Comments should be an array');
                assert.include(res.body.comments, 'This is a test comment', 'Comments should include the new comment');
                assert.equal(res.body._id, bookId, 'Returned book should have the correct id');
                assert.equal(res.body.title, 'Test Book for Comment', 'Returned book should have the correct title');
                done();
              });
          });
      });

      
      test('Test POST /api/books/[id] without comment field', function(done) {
        // First, create a book to test with
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Comment' })
          .end(function(err, res) {
            let bookId = res.body._id;
            
            // Now test the POST route with the created book's id without comment
            chai.request(server)
              .post('/api/books/' + bookId)
              .send({})
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'missing required field comment');
                done();
              });
          });
      });

      
      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post('/api/books/invalidid123')
          .send({ comment: 'This is a test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      
      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        // First, create a book to test with
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Deletion' })
          .end(function(err, res) {
            let bookId = res.body._id;
            
            // Now test the DELETE route with the created book's id
            chai.request(server)
              .delete('/api/books/' + bookId)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'delete successful');
                
                // Verify that the book is actually deleted
                chai.request(server)
                  .get('/api/books/' + bookId)
                  .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'no book exists');
                    done();
                  });
              });
          });
      });

      
      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/invalidid123')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
