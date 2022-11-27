const Item = require("../models/item");
const Category = require("../models/category");
const Supplier = require("../models/supplier");

const async = require("async");

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
    console.log(results)
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
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display Item delete form on GET.
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle Item delete on POST.
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display Item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST.
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};