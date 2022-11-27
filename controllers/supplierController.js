const Supplier = require("../models/supplier");
const Item = require("../models/item");

const async = require("async");

// Display list of all Suppliers.
exports.supplier_list = (req, res, next) => {
  Supplier.find({})
    .sort({name: 1})
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("supplier_list", {
        title: "Supplier list",
        supplier_list: results
      });
    });
};


// Display detail page for a specific Supplier.
exports.supplier_detail = (req, res) => {
  async.parallel({ 
    supplier(callback) {
      Supplier.findById(req.params.id)
        .exec(callback)
    },
    suppliers_items(callback) {
      Item.find({supplier: req.params.id}, "name description")
        .exec(callback)
    },
  },
  (err, results) => {
    if (err) {
      return next(err);
    };
    if (results.supplier == null) {
      const err = new Error("Supplier not found")
      err.status = 404;
      return next(err);
    };
    // Supplier found, so render
    console.log(results.supplier)
    res.render("supplier_detail", {
      title: "Supplier detail",
      supplier: results.supplier,
      supplier_items: results.suppliers_items,
    });
  });
};

// Display Supplier create form on GET.
exports.supplier_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier create GET");
};

// Handle Supplier create on POST.
exports.supplier_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier create POST");
};

// Display Supplier delete form on GET.
exports.supplier_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier delete GET");
};

// Handle Supplier delete on POST.
exports.supplier_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier delete POST");
};

// Display Supplier update form on GET.
exports.supplier_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier update GET");
};

// Handle Supplier update on POST.
exports.supplier_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier update POST");
};