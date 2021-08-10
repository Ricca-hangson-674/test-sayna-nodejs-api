process.env.NODE_ENV = 'test';

import mongoose from 'mongoose'
import User from '../src/models/userModel.js'

//Require the dev-dependencies
import  chai from 'chai'
import  chaiHttp from 'chai-http'
import  server from '../server.js'

let should = chai.should();

describe('Books', () => {
    beforeEach((done) => {
        Book.remove({}, (err) => {
           done();
        });
    });
    

 /*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
            chai.request(server)
            .get('/users')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
   * Test the /POST route
   */
  describe('/POST user', () => {
      it('it should not POST a user without pages field', (done) => {
          let book = {
              title: "The Lord of the Rings",
              author: "J.R.R. Tolkien",
              year: 1954
          }
            chai.request(server)
            .post('/user')
            .send(book)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('errors');
                  res.body.errors.should.have.property('pages');
                  res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a user ', (done) => {
          let book = {
              title: "The Lord of the Rings",
              author: "J.R.R. Tolkien",
              year: 1954,
              pages: 1170
          }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Book successfully added!');
                  res.body.book.should.have.property('title');
                  res.body.book.should.have.property('author');
                  res.body.book.should.have.property('pages');
                  res.body.book.should.have.property('year');
              done();
            });
      });
  });

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id user', () => {
      it('it should GET a user by the given id', (done) => {
          let user = new User({ 
                title: "The Lord of the Rings", 
                author: "J.R.R. Tolkien", 
                year: 1954, 
                pages: 1170 });
          book.save((err, book) => {
              chai.request(server)
            .get('/book/' + book.id)
            .send(book)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('title');
                  res.body.should.have.property('author');
                  res.body.should.have.property('pages');
                  res.body.should.have.property('year');
                  res.body.should.have.property('_id').eql(book.id);
              done();
            });
          });

      });
  });
  
  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id user', () => {
      it('it should UPDATE a user given the id', (done) => {
          let user = new User({
                title: "The Chronicles of Narnia", 
                author: "C.S. Lewis", 
                year: 1948, 
                pages: 778})
                user.save((err, user) => {
                chai.request(server)
                .put('/book/' + book.id)
                .send({
                    title: "The Chronicles of Narnia", 
                    author: "C.S. Lewis", 
                    year: 1950, 
                    pages: 778})
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Book updated!');
                      res.body.book.should.have.property('year').eql(1950);
                  done();
                });
          });
      });
  });

 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
      it('it should DELETE an user given the id', (done) => {
          let user = new Book({
                title: "The Chronicles of Narnia", 
                author: "C.S. Lewis", 
                year: 1948, 
                pages: 778})
                user.save((err, user) => {
                chai.request(server)
                .delete('/book/' + book.id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Book successfully deleted!');
                      res.body.result.should.have.property('ok').eql(1);
                      res.body.result.should.have.property('n').eql(1);
                  done();
                });
          });
      });
  });
});