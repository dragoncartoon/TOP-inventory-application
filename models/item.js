const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type:String, required: true, maxLength: 100 },
  description: {type: String, maxLength: 200},
  price: {type: Number, required: true},
  number_in_stock: {type: Number, required: true},
  category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
  supplier: {type: Schema.Types.ObjectId, ref: 'Supplier'},
});

// Virtual url for supplier
ItemSchema.virtual("url").get(function(){
  return `/inventory/item/${this.id}`;
})

module.exports = mongoose.model("Item", ItemSchema);