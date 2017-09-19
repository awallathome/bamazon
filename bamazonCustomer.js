var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connect = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connect.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to display products andprompt the user
  console.log("Connected!");
  start();
});

function start() {
  connect.query("SELECT * FROM bamazon.products", function (err, res) {
    if (err) throw err;
    console.log("Here are some things for sale:" + "\n============================\n");
    for (var i = 0; i < res.length; i++) {
      console.log("item number: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nDepartment: " +
        res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n")
    };
    inquirer.prompt({
      name: "itemid",
      type: "input",
      message: "What is the ID of the item you want to buy?",
      validate: function (value) {
        if (isNaN(value)) {
           console.log("\nPlease enter a number.");
           return false;
        }
        if (doesItExist(res, value)) {
          return true;
        }
        
      }
    }).then(function (answers) {
      inquirer.prompt({
        name: "itemid",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (value) {
          var total = connect.database.bamazon.products;
          var pass = ((value > 0) && (value < total.length));
          if (pass) {
            return true;
          }
          //COME BACK here too to check for an integer AND to check if there are that many available...
          return "We don't have that many.";
        }
      })
    })
  })
}

function doesItExist(itemArray, item_id) {
  for (i = 0; i < itemArray.length; i++) {
    if (itemArray[i] === itemArray[i].item_id) {
      return true;
    } 
  } 
  return false;
}

