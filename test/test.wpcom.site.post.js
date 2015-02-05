
/**
 * WPCOM module
 */

var WPCOM = require('../');
var Site = require('../lib/site');
var util = require('./util');
var assert = require('assert');

/**
 * Testing data
 */

var fixture = require('./fixture');

/**
 * WPCOM instance
 */

describe('wpcom.site.post', function(){
  // Create `wpcom` and `site` global instances
  var wpcom = WPCOM(fixture.site.token);
  var site = wpcom.site(fixture.site.url);

  // var to store post in `add()` test
  var new_post;
  var site_ID;

  // Create a testing_post before to start the tests
  var testing_post;
  before(function(done){
    site.addPost(fixture.post, function (err, data_post) {
      if (err) throw err;

      testing_post = data_post;
      site.get(function(err, data_site){
        if (err) return done(err);

        site_ID = data_site.ID;
        done();
      });

    });
  });

  after(function(done){
    // delete testing_post post
    site.deletePost(testing_post.ID, function(err, post) {
      if (err) throw err;

      done();
    });
  });

  describe('wpcom.site.post.get', function(){
    it('should get added post (by id)', function(done){
      var post = site.post(testing_post.ID);
      post.get(function(err, data){
        if (err) throw err;

        assert.equal(testing_post.ID, data.ID);
        assert.equal(testing_post.site_ID, data.site_ID);
        done();
      });
    });

    it('should get passing a query object', function(done){
      var post = site.post(testing_post.ID);
      post.get({ content: 'edit' }, function(err, post){
        if (err) throw err;

        assert.equal(testing_post.ID, post.ID);
        assert.equal(testing_post.site_ID, post.site_ID);
        done();
      });
    });

    it('should get added post (by slug)', function(done){
      var post = site.post({ slug: testing_post.slug });
      post.get(function(err, post){
        if (err) throw err;

        assert.equal(testing_post.ID, post.ID);
        assert.equal(testing_post.site_ID, post.site_ID);
        done();
      });
    });
  });

  describe('wpcom.site.post.add', function(){
    it('should add a new post', function(done){
      var post = site.post();
      fixture.post.title += '-added';

      post.add(fixture.post, function(err, data){
        if (err) throw err;

        // checking some data date
        assert.ok(data);
        assert.ok(data instanceof Object, 'data is not an object');
        assert.equal(site_ID, data.site_ID);
        new_post = data;

        done();
      });
    });

  });

  describe('wpcom.site.post.update', function(){
    it('should edit the new added post', function(done){
      var post = site.post(testing_post.ID);
      var new_title = fixture.post.title + '-updated';

      post.update({ title: new_title }, function(err, data){
        if (err) throw err;

        assert.ok(data);
        assert.equal(new_title, data.title);

        done();
      });
    });
  });

  describe('wpcom.site.post.likesList', function(){
    it('should get post likes list', function(done){
      var post = site.post(testing_post.ID);

      post.likesList(function(err, data){
        if (err) throw err;

        assert.ok(data);

        assert.equal('number', typeof data.found);
        assert.equal('boolean', typeof data.i_like);
        assert.equal('object', typeof data.likes);
        assert.ok(data.likes instanceof Array);

        done();
      });
    });
  });

/*
  describe('post.related()', function(){

    it('should get related posts', function(done){
      var site = util.private_site();
      var post = site.post(testing_post.ID);

      post.related({ size: 5 }, function(err, data){
        if (err) throw err;

        assert.ok(data);
        assert.equal('number', typeof data.total);
        assert.ok(data.hits instanceof Array);

        done();
      });

    });

  });
*/

  describe('post.delete()', function(){

    it('should delete the new added post', function(done){
      var site = util.private_site();
      var post = site.post(testing_post.ID);

      post.delete(function(err, data){
        if (err) throw err;

        assert.ok(data);
        assert.equal(testing_post.ID, data.ID);

        done();
      });
    });

  });

  describe('post.comments()', function(){

    it('should get the post like status of mine', function(done){
      util.private_site()
      .post(testing_post.ID)
      .comments(function(err, data){
        if (err) throw err;

        assert.equal('number', typeof data.found);
        assert.equal('object', typeof data.comments);
        assert.ok(data.comments instanceof Array);

        done();
      });
    });

  });

  describe('post.restore()', function(){

    it('should restore a post from trash', function(done){
      var site = util.private_site();
      var post = site.post();

      post.add(fixture.post, function(err, data){
        if (err) throw err;

        post = site.post(data.ID);

        post.delete(function(err, data){
          if (err) throw err;

          post.restore(function(err, data){
            if (err) throw err;

            assert.ok(data);
            assert.equal(testing_post.status, data.status);

            post.delete(function(err, data){
              if (err) throw err;

              done();
            });
          });
        });
      });
    });

  });

});
