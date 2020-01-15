var postcss = require("postcss");

var Flegrix = require("./main");
var flegrix = new Flegrix();

exports.__esModule = true;
exports.default = postcss.plugin("flegrix", () => root => {
  root.walkAtRules("flegrix", atRule => {
    var params = atRule.params.replace(/[()]/g, "").split(/\s/, 2);
    var name = params[0];
    var preset = params[1] || "default";

    // general default
    if (!name) {
      flegrix.default(atRule);
    }

    if (name === "grid") {
      flegrix.grid(preset, atRule);
    }

    if (name === "container") {
      if (atRule.parent) {
        var container = flegrix.container(preset, atRule);
        container.forEach(item =>
          atRule.parent.insertAfter(atRule, postcss.decl(item))
        );
      }
    }

    if (name === "col") {
      if (atRule.parent) {
        var col = flegrix.col(preset, atRule);
        col.forEach(item =>
          atRule.parent.insertAfter(atRule, postcss.decl(item))
        );
      }
    }
    atRule.remove();
  });
});
module.exports = exports["default"];
