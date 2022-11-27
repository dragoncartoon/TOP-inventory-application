const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: {type:String, required: true, maxLength: 100 },
  description: {type: String, maxLength: 200},
});

// Virtual url for supplier
SupplierSchema.virtual("url").get(function(){
  return `/supplier/${this.id}`;
})

module.exports = mongoose.model("Supplier", SupplierSchema);