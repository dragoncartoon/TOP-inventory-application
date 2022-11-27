#! /usr/bin/env node

console.log('This script populates some category, items, suppliers to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Supplier = require('./models/supplier')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');

var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var suppliers = []
var items = []
var categories = []

// function authorCreate(first_name, family_name, d_birth, d_death, cb) {
//   authordetail = {first_name:first_name , family_name: family_name }
//   if (d_birth != false) authordetail.date_of_birth = d_birth
//   if (d_death != false) authordetail.date_of_death = d_death
  
//   var author = new Author(authordetail);
       
//   author.save(function (err) {
//     if (err) {
//       cb(err, null)
//       return
//     }
//     console.log('New Author: ' + author);
//     authors.push(author)
//     cb(null, author)
//   }  );
// }

function CategoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description});
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    // console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function SupplierCreate(name, description, cb) {
  var supplier = new Supplier({ name: name, description: description});
       
  supplier.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    // console.log('New Supplier: ' + supplier);
    suppliers.push(supplier)
    cb(null, supplier);
  });
}

function ItemCreate(name, description, price, number_in_stock, category, supplier, cb) {
  itemdetail = {
    name: name, 
    description: description, 
    price: price, 
    number_in_stock: number_in_stock,
  }
  if (category != false) itemdetail.category = category;
  if (supplier != false) itemdetail.supplier = supplier;

  var item = new Item(itemdetail);
  item.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  });
}

function createCategory(cb) {
  async.parallel([
      function(callback) {
        CategoryCreate('Laptop','a computer that is portable and suitable for use while traveling.', callback);
      },
      function(callback) {
        CategoryCreate('Headset','a set of headphones, typically with a microphone attached, used especially in telephone and radio communication.', callback);
      },
      function(callback) {
        CategoryCreate('Gaming chair','a type of chair designed for the comfort of gamers.', callback);
      },
      function(callback) {
        CategoryCreate('Personal computer','A personal computer (PC) is a multi-purpose microcomputer whose size, capabilities, and price make it feasible for individual use.', callback);
      },
      ],
      // optional callback
      cb);
}

function createSupplier(cb) {
  async.parallel([
      function(callback) {
        SupplierCreate('Phong Vũ','CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ PHONG VŨ', callback);
      },
      function(callback) {
        SupplierCreate('Lê Phụng','Lê Phụng Computer', callback);
      },
      function(callback) {
        SupplierCreate('Tân Doanh','Cửa Hàng Vi Tính Tân Doanh', callback);
      },
      function(callback) {
        SupplierCreate('KCCSHOP','CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VÀ CÔNG NGHỆ KHÁNH CHUNG.', callback);
      },
      ],
      // optional callback
      cb);
}

function createItem(cb) {
  async.parallel([
    function(callback) {
      ItemCreate('ThinkPad T14s Gen 3 (14", Intel)', 'Powerful, slim 14" business laptop with Intel® vPro® processors & Intel® Iris® Xe graphics', 1599, 2, [categories[0],categories[1]], suppliers[0], callback);
    },
    function(callback) {
      ItemCreate('HP EliteBook 845 G9 Notebook PC', 'Take some friction out of working remotely with the HP EliteBook 845. Built to seamlessly fit into enterprise IT, it also comes with features that delight its users', 1141, 5, [categories[0]], suppliers[1], callback);
    },
    function(callback) {
      ItemCreate('DT 990 PRO', 'Studio headphones for mixing and mastering (open)', 250, 10, [categories[1]], suppliers[0], callback);
    },
    function(callback) {
      ItemCreate('GTChair Dvary Butterfly', 'Task Chair, Back Color Family Black, Back Material Family Mesh', 700, 6, [categories[2]], suppliers[3], callback);
    },
    function(callback) {
      ItemCreate('Dell OptiPlex 7000 Desktop Computer ', 'Intel Core i7 2.10 GHz processor provides lightning fast speed and peak performance even for toughest tasks and intensive games', 1339, 2, [categories[3]], false, callback);
    },
    ],
    cb);
}


async.series([
    createCategory,
    createSupplier,
    createItem,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Successful');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




