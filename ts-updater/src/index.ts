var fs = require("fs");
var path = require("path");
var Mustache = require("mustache");
var fetch = require("node-fetch");

// Get external data with fetch
const data = fetch("data.json").then((response) => {
  return response.json();
});

// Get external template with fetch
const template = fetch("server.cfg").then((response) => {
  return response.text();
});

// wait for all the data to be received
Promise.all([data, template])
  .then((response) => {
    const resolvedData = response[0];
    const resolvedTemplate = response[1];

    // Cache the template for future uses
    Mustache.parse(resolvedTemplate);

    var output = Mustache.render(resolvedTemplate, resolvedData);

    // Write out the rendered template
    return fs.writeFile("server.cfg", output, (err: any) => {
      if (err) throw err;
      console.log("generated template");
    });
  })
  .catch((error) =>
    console.log("Unable to get all template data: ", error.message)
  );
