const Supplier = require("../models/supplier");
const Item = require("../models/item");

const async = require("async");
const {body, validationResult} = require("express-validator") 

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
  res.render("supplier_form", { title: "Create Supplier" });
};

// Handle Supplier create on POST.
exports.supplier_create_post = [
  // Validate and sanitize the name field
  body("name", "Supplier name required").trim().isLength({min: 1}).escape(),
  // Continue process request after validation
  (req, res, next) => {
    // Extract validation errors from a request.
    const errors = validationResult(req);
    // Create supplier object with escaped and trimmed data.
    const supplier = new Supplier({name: req.body.name});

    if (!errors.isEmpty()) {
      // Catch errors. Render the form again with sanitized values/ error messages.
      res.render("supplier_form", {
        title: "Create Supplier",
        supplier,
        errors: errors.array(),
      });
      return;
    } else {
      // Form is valid
      // Check is Supplier with same name exists.
      Supplier.findOne({name: req.body.name}).exec((err, found_supplier) => {
        if (err) {
          return next(err);
        }
        if (found_supplier) {
          // Supplier exist, redirect to its detail page.
          res.redirect(found_supplier.url);
        } else {
          supplier.save((err) => {
            if (err) {
              return next(err);
            };
            // Saved. Redirect to its detail page.
            res.redirect(supplier.url);
          });
        };
      });
    };
  },
];

// Display Supplier delete form on GET.
exports.supplier_delete_get = (req, res, next) => {
  async.parallel(
    {
      supplier(callback) {
        Supplier.findById(req.params.id).exec(callback);
      },
      suppliers_items(callback) {
        Item.find({supplier: req.params.id}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      };
      if (results.supplier === null) {
        // No results
        res.redirect("/inventory/suppliers");
      }
      // Success, so render
      res.render("supplier_delete", {
        title: "Delete supplier",
        supplier: results.supplier,
        supplier_item: results.suppliers_items,
      });
    },
  );
};

// Handle Supplier delete on POST.
exports.supplier_delete_post = (req, res, next) => {
  // async.parallel({

  // })
};

// Display Supplier update form on GET.
exports.supplier_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier update GET");
};

// Handle Supplier update on POST.
exports.supplier_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier update POST");
};