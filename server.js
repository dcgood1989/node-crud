var fs = require("fs"),
    http = require("http"),
    mongoose = require("mongoose"),
    jade = require('jade');

// load Car model
var carAttrs = require("./car.js"),
    carSchema = mongoose.Schema(carAttrs);


var Car = mongoose.model('Car', carSchema);
mongoose.connect('mongodb://localhost/crud_sans_frameworks');

function parseRequest(requestUrl) {
  var splitUrl = requestUrl.split("/")
  return splitUrl[splitUrl.length - 1]
}

function parseRequestEdit(requestUrl) {
  var splitUrl = requestUrl.split("/")
  return splitUrl[splitUrl.length - 2]
}

//   if (parseRequest(req.url) === "/cars") {
//     res.end("INDEX!")
//   } else if (parseRequest(req.url) === "show") {
//     res.end("SHOW")
  // } else if (parseRequest(req.url) === "edit") {
  //   res.end("EDIT")
//       }
//     }
//   }
//   split request url on '/'
//   /cars
//   ["cars"]
//   length of 1, then it must be the index
//   last elements is cars, so show index
//
//   /cars/new
//   ["cars", "new"]
//   last element is new
//
//   /cars/fljdskajfdas/show
//   ["cars", "fljdskajfdas" "show"]
//   last element is show
//
//   /cars/fljdskajfdas/edit
//   ["cars", "fljdskajfdas" "edit"]
//   last element is edit
//
//   /cars/fljdskajfdas/update
//   ["cars", "fljdskajfdas" "update"]
//   last element is update
//
//   /cars/fljdskajfdas/destroy
//   ["cars", "fljdskajfdas" "destroy"]
//   last element is destroy
//
// }
var handleRequest = function(req, res) {
  // redirect users to /cars if they try to hit the homepage
  if (req.url == '/') {
    res.writeHead(301, {Location: 'http://localhost:1337/cars'})
    res.end();
  }

  if (req.url == '/cars' && req.method === "GET") {
    // Synchronously load the index jade template (http://jade-lang.com/)
    var index = fs.readFileSync('index.jade', 'utf8');
    // Compile template
    var compiledIndex = jade.compile(index, { pretty: true, filename: 'index.jade' });

    Car.find({}, function(err, cars) {
      var rendered = compiledIndex({cars: cars});
      res.end(rendered);
    })

    // example of data that can be passed in to the Jade template:
    // in your CRUD app, a call to Mongoose should return all of the Cars
  //   var sampleDataForCars = { cars: [
  //     { driver: 'Andreas', make: 'Nissan', model: 'Xterra', year: 2005 },
  //     { driver: 'Bob Ross', make: 'Ford', model: 'Pinto', year: 1972 }
  //   ],
      headline: "Welcome to the Cars CRUD App"
  // };


    // Render jade template, passing in the info
    // var rendered = compiledIndex(sampleDataForCars);
    //
    // Write rendered contents to response stream
    // res.end(rendered);

  } else if (req.url === "/cars" && req.method === "POST") {
    var postParams = {};
    req.on('data', function(data) {
      data = data.toString().split('&');
      for (var i = 0; i < data.length; i++) {
        var _data = data[i].split('=');
        postParams[_data[0]] = _data[1];
      }
      console.log(postParams);
    var car = new Car(postParams);
    car.save(function (err) {
      if (err)
      console.log(err);


    });

    res.writeHead(301, {Location: 'http://localhost:1337/cars'})
    res.end()
  });

// } else if (req.url === "/cars/:id/edit")


  } else if (req.url ==="/cars/new") {
    var newTemplate = fs.readFileSync('new.jade', 'utf8');
    var compiledNewTemplate = jade.compile(newTemplate, { pretty: true, filename: 'new.jade' });
    res.end(compiledNewTemplate())

  } else if (parseRequest(req.url) === "edit") {
    var editTemplate = fs.readFileSync('edit.jade', 'utf8');
    var compiledEditTemplate = jade.compile(editTemplate, { pretty: true, filename: 'edit.jade' });
    res.end(compiledEditTemplate())

  } else if (parseRequest(req.url) === "show") {
    var showTemplate = fs.readFileSync('show.jade', 'utf8');
    var compiledShowTemplate = jade.compile(showTemplate, { pretty: true, filename: 'show.jade' });
    res.end(compiledShowTemplate())


  } else {
    // Your code might go here (or it might not)
    res.writeHead(200);
  }
};

var server = http.createServer(handleRequest);
server.listen(1337);
