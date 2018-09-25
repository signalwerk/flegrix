var postcss = require("postcss");
var PostCSSFlegrix = require("../flegrix");
var Flegrix = require("../src/main");
var flegrix = new Flegrix();

var fs = require("fs");

var contents = fs.readFileSync("../doc/main.post.css", "utf8");

var plugin = postcss([PostCSSFlegrix.default])
  .process(contents)
  .then(result => {
    fs.writeFileSync("../doc/main.post.final.css", result.css);

    console.log(result.css);
  });
