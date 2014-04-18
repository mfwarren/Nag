
var Blog = require('../models/Blog');

/**
 * GET /account/blogs
 * list page.
 */

exports.getBlogs = function(req, res) {
  Blog.find({user: req.user.id}, function(err, blogs) {
    if (err) return next(err);

    res.render('blogs/list', {
      title: 'Your Blogs',
      blogs: blogs
    });
  });
};

exports.getBlog = function(req, res) {
  Blog.findOne({user: req.user.id, _id: req.params['id']}, function(err, blog) {
    if (err) return next(err);

    res.render('blogs/edit', {
      title: 'Your Blog',
      blog: blog
    });
  });
};

exports.postUpdateBlog = function(req, res, next) {
  console.log(req);
  Blog.findById(req.params['id'], function(err, blog) {
    if (err) return next(err);
    blog.title = req.body.title || '';
    blog.url = req.body.url || '';
    blog.days_until_nag = req.body.days || '';

    blog.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Nag information updated.' });
      res.redirect('/account/blogs');
    });
  });
};

exports.getNewBlog = function(req, res) {
  res.render('blogs/new', {
    title: 'New Nag'
  });
};

exports.postNewBlog = function(req, res, next) {
  req.assert('title', "Name cannot be blank").notEmpty();
  req.assert('url', 'URL cannot be blank').notEmpty();
  req.assert('days', 'Days cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('account/blog/new');
  }

  var blog = new Blog({
    title: req.body.title,
    url: req.body.url,
    days_until_nag: req.body.days,
    user: req.user
  });

  blog.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        req.flash('errors', { msg: 'Blog with that name already exists.' });
      }
      return res.redirect('/account/blog/new');
    }
    return res.redirect('/account/blogs');
  });
}

exports.postDeleteBlog = function(req, res, next) {
  Blog.remove({ _id: req.params['id'] }, function(err) {
    if (err) return next(err);
    res.redirect('/account/blogs');
  });
};
