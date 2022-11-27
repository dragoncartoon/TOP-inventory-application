
const Supplier = require("../models/supplier");

// Display list of all Suppliers.
exports.supplier_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Supplier list");
};

// Display detail page for a specific Supplier.
exports.supplier_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Supplier detail: ${req.params.id}`);
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