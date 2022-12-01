const Category = require("../models/category");
const Item = require("../models/item")

const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Category.
exports.category_list = (req, res, next) => {
  Category.find({})
    .sort({name: 1})
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("category_list", {
        title: "Category list",
        category_list: results
      });
    });
};

// Display detail page for a specific Category.
exports.category_detail = (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
  async.parallel({
    category(callback) {
      Category.findById(req.params.id)
        .exec(callback);
    },
    category_items(callback) {
      Item.find({category: req.params.id})
        .exec(callback);
    },
  },
    (err, results) => {
      if (err) {
        return next(err);
      };
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      console.log(results.category_items)
      // Success then render
      res.render("category_detail", {
        title: "Category detail",
        category: results.category,
        category_items: results.category_items,
        
      });
    }
  );
};



// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Category create GET");
  res.render("category_form", {title: "Create category"});
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize data
  body("name")
    .trim()
    .isLength({min: 2})
    .escape()
    .withMessage("Category must longer than 2 character"),
    (req, res, next) => {
      // Extract validation errors
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        // There are errors. Render form again with sanitized message
        res.render("category_form", {
          title: "Create category",
          category : req.body,
          errors: errors.array(),
        });
        return;
      }
      // Data is valid
      // Create new category
      const category = new Category({
        name: req.body.name,
      });
      category.save((err) => {
        if (err) {
          return next(err);
        };
        // Save success, redirect to new category record
        res.redirect(category.url);
      });
    },
];
  

// Display Category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle Category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
};

// Display Category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};