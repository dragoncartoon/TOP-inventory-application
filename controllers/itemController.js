const Item = require("../models/item");
const Category = require("../models/category");
const Supplier = require("../models/supplier");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      supplier_count(callback){
        Supplier.countDocuments({}, callback);
      },
      category_count(callback){
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Inventory Application Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all Items.
exports.item_list = (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Item list");
  Item.find({})
    .sort({name: 1})
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_list", {
        title: "Item list",
        item_list: results
      });
    });
};

// Display detail page for a specific Item.
exports.item_detail = (req, res) => {
  // res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
  async.parallel({
    item(callback) {
      Item.findById(req.params.id)
        .populate("category")
        .populate("supplier")
        .exec(callback)
    },
  },
  (err, results) => {
    if (err) {
      return next(err);
    };
    if (results.item ==null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    };
    // Successful, so render
    res.render("item_detail", {
      title: "Item detail",
      item: results.item,
    });
  });
};




// Display Item create form on GET.
exports.item_create_get = (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Item create GET");
  // res.render("item_form", {title: "Create item"})
  // Get all category and supplier, which adding to item 
  async.parallel(
    {
      category(callback) {
        Category.find(callback);
      },
      supplier(callback) {
        Supplier.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      };
      res.render("item_form", {
        title: "Create item",
        categories: results.category,
        suppliers: results.supplier,
      });
    },
  );
};

// Handle Item create on POST.
exports.item_create_post = [
  (req, res, next) => {
    // Convert category to array.
    if (!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
    };
    next()
  },

  // Validate and sanitize data
  body("name", "Item name must not be empty")
    .trim()
    .isLength({min: 2})
    .withMessage("Item name must longer than 2 characters")
    .escape(),
  body("price", "Price must be number")
    .isCurrency({allow_negatives: false}),
  body("number_in_stock", "Must between 0 - 9999")
    .isInt({min: 0, max: 9999}),
  body("category.*")
    .escape(),
  body("supplier")
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create Item object with escape and validation data
    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      supplier: req.body.supplier, 
    });

    if (!errors.isEmpty()) {
      // There are errors, render form again with value and errors message.
      
      // Get all supplier and category for form
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
          suppliers(callback) {
            Supplier.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          };
          // Mark selected category
          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checkedbox = "true";              
            }
          }

          res.render("item_form", {
            title: "Create item",
            categories: results.categories,
            suppliers: results.suppliers,
            item,
            errors: errors.array(),
          });
        },
      );
      return;
    };

    // Data is valid, save item
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Save success, redirect to new item record
      res.redirect(item.url);
    });
  },
]

// Display Item delete form on GET.
exports.item_delete_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      };
      // If category not exist, redirect to list.
      if (results.item == null ) {
        res.redirect("/inventory/items")
      }

      // Found category, render
      res.render("item_delete", {
        title: "Delete item",
        item: results.item,
      });
    }
  );
};


// Handle Item delete on POST.
exports.item_delete_post = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.body.itemid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      };
      // No items left, so delete item
      Item.findByIdAndRemove(req.body.itemid, (err) => {
        if (err) {
          return next(err);
        };
        // Success, redirect to item list
        res.redirect("/inventory/items");
      }); 
    },
  );
};

// Display Item update form on GET.
exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate("supplier")
          .populate("category")
          .exec(callback);
      },
      suppliers(callback) {
        Supplier.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      };
      if (results.item == null) {
        // No results
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      };
      // Success
      // Mark selected category as checked
      for (const category of results.categories) {
        for (const categoryItem of results.item.category) {
          if (category._id.toString() === categoryItem._id.toString()) {
            category.checkedbox = "true";
            // console.log(category)
          }
        }
      }
      
      res.render("item_form", {
        title: "Update tem",
        item: results.item,
        categories: results.categories,
        suppliers: results.suppliers,
      })
    },
  );
};


// Handle Item update on POST.
exports.item_update_post = [
  // Convert category to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize data
  body("name", "Item name must not be empty")
  .trim()
  .isLength({min: 2})
  .withMessage("Item name must longer than 2 characters")
  .escape(),
  body("price", "Price must be number")
  .isCurrency({allow_negatives: false}),
  body("number_in_stock", "Must between 0 - 9999")
  .isInt({min: 0, max: 9999}),
  body("category.*")
  .escape(),
  body("supplier")
  .escape(),

  // Process request after validate
  (req, res, next) => {
    const errors = validationResult(req);
    
    // Create Item object with escape and validation data
    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      supplier: req.body.supplier, 
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with validated message.

      // Get all category and supplier for form
      async.parallel(
        {
          suppliers(callback) {
            Supplier.find(callback)
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          };

          // Mark selected category as checked
          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checked = "true";
            };
          };
          res.render("item_form", {
            title: "Update item",
            category: results.categories,
            supplier: results.suppliers,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Form is valid. Update record
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, updateItem) => {
      if (err) {
        return next(err)
      };

      // Successful, redirect to detail page
      res.redirect(updateItem.url)
    });
  },
];


