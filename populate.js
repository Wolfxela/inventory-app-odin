#! /usr/bin/env node

console.log(
    'This script populates some test Items, Categorys, genres and Iteminstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item_model");
  const Category = require("./models/category_model");
  
  const categorys = [];
  const Items = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);

  console.log(userArgs[0])
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategorys();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  
  async function CategoryCreate(index, name, description) {
    const Categorydetail = {name: name, description: description};
  
    const category = new Category(Categorydetail);
  
    await category.save();
    categorys[index] = category;
    console.log(`Added Category: ${name} ${description}`);
  }
  
  async function ItemCreate(index, name, category, price, description, stock) {
    const Itemdetail = {
      name: name,
      category: category,
      price: price,
      stock: stock,
    };
    if (description != false) Itemdetail.description = description;
  
    const item = new Item(Itemdetail);
    await item.save();
    Items[index] = item;
    console.log(`Added Item: ${name}`);
  }
  
  async function createCategorys() {
    console.log("Adding Categorys");
    await Promise.all([
      CategoryCreate(0, "Cloth", "General clothing items such as t-shirts and hoodies",),
      CategoryCreate(1, "Food", "Water, Potatoes, Soups",),
      CategoryCreate(2, "Electronics", "Phones, Tablets, Robots"),
    ]);
  }
  
  async function createItems() {
    console.log("Adding Items");
    await Promise.all([
      ItemCreate(0,
        "Iphone 20",
        categorys[2],
        2000,
        "It's just like the last 10 iphones, but more expensive!",
        9
      ),
      ItemCreate(1,
        "Ipad 3",
        categorys[2],
        450,
        "A brand new ipad 3!",
        6
      ),
      ItemCreate(2,
        "Pizza",
        categorys[1],
        12,
        "Toppings may include: Cheese, Ketchup,Sausages,Pineapple and Mushrooms!",
        51
      ),
      ItemCreate(3,
        "Apples",
        categorys[1],
        3,
        "Fresh apples!",
        52
      ),
      ItemCreate(4,
        "Blue t-shirt",
        categorys[0],
        20,
        "A simple blue t-shirt with white stripes, perfect for a summer holiday!",
        2
      ),
      ItemCreate(5,
        "Hoodie",
        categorys[0],
        32,
        "A simple padded hoodie, perfect for the winter holiday!",
        42
      ),
      ItemCreate(6,
        "Beanie",
        categorys[0],
        10,
        false,
        23
      ),
    ]);
  }