class Flegrix {
  constructor() {
    this.mode = "flexbox";
  }

  mixin(root, param) {
    let config = this.parse(root);

    if (param.includes("col")) {
      return this.col(config);
    }
    if (param.includes("container")) {
      return this.container(config);
    }

    return [];
  }

  parse(root) {
    let parsed = {
      from: 0,
      to: 0,
      columns: 12,
      push: 0,
      gutter: 3,
      debug: false,
      context: 12
    };

    root.walkDecls("from", function(decl) {
      parsed.from = parseFloat(decl.value, 10);
    });
    root.walkDecls("to", function(decl) {
      parsed.to = parseFloat(decl.value, 10);
    });
    root.walkDecls("columns", function(decl) {
      parsed.columns = parseFloat(decl.value, 10);
    });
    root.walkDecls("context", function(decl) {
      parsed.context = parseFloat(decl.value, 10);
    });
    root.walkDecls("debug", function(decl) {
      if (`${decl.value}`.toLowerCase().includes("true")) {
        parsed.debug = true;
      }
    });
    root.walkDecls("of", function(decl) {
      parsed.columns = parseFloat(decl.value, 10);
    });
    root.walkDecls("push", function(decl) {
      parsed.push = parseFloat(decl.value, 10);
    });
    root.walkDecls("gutter", function(decl) {
      parsed.gutter = parseFloat(`${decl.value}`.replace("%", ""), 10);
    });

    return parsed;
  }

  container(config) {
    let { debug } = config;
    let css = [];

    if (this.mode === "flexbox") {
      css.push({
        prop: "display",
        value: "flex"
      });

      css.push({
        prop: "flex-wrap",
        value: "wrap"
      });
      css.push({
        prop: "justify-content",
        value: "space-between"
      });
    }

    if (debug) {
      css.push({
        prop: "background-size",
        value: "100% 100%"
      });
      css.push({
        prop: "background-position",
        value: "center 0"
      });
      css.push({
        prop: "background-repeat",
        value: "repeat-y"
      });
      css.push({
        prop: "background-image",
        value: `url("data:image/svg+xml;base64,${this.b64encode(
          this.svg(config)
        )}")`
      });
    }

    return css;
  }

  col(config) {
    let { from, to, columns, push, gutter, context } = config;
    let css = [];

    css.push({
      prop: "flex-grow",
      value: 1
    });
    css.push({
      prop: "flex-shrink",
      value: 1
    });
    css.push({
      prop: "flex-basis",
      value: `${this.span(config)}%`
    });
    css.push({
      prop: "max-width",
      value: `${this.span(config)}%`
    });
    if (push) {
      css.push({
        prop: "margin-left",
        value: `${this.push({ from: 1, to: push, columns, gutter, context })}%`
      });
    }
    return css;
  }

  push(config) {
    return this.span(config) + this.gutter(config);
  }

  // get the width
  // span(4) == span(1 to 4 of 12)
  span(config) {
    let { from, to, columns, gutter, context } = config;
    let colCount = to - from + 1;
    let calcGutter = this.gutter(config);
    let totalColumnWidth = 100 - calcGutter * (columns - 1);

    let width =
      totalColumnWidth / columns * colCount + calcGutter * (colCount - 1);

    return width;
  }

  gutter(config) {
    let { columns, gutter, context } = config;
    return gutter / columns * context;
  }

  // from here
  // https://gist.github.com/WebReflection/ed05681fe73ece4917de850c2c3bd7a1
  b64encode(string) {
    const base64 = {
      encode:
        typeof btoa === "function"
          ? // Browsers
            str => btoa(unescape(encodeURIComponent(str)))
          : // NodeJS
            str => Buffer.from(str).toString("base64")
    };

    return base64.encode(string);
  }

  svg(config) {
    let { columns, gutter, context } = config;

    let color = "rgba(255,0,0,0.07)";
    let lineColor = "rgba(128,0,0,0.05)";
    let width = this.span({ from: 1, to: 1, columns, gutter, context });
    let calcGutter = this.gutter(config);

    let style = `<style><![CDATA[
            line {
              stroke: ${lineColor};
              stroke-width: 1;
            }
            ]]></style>`;
    let x = 0;
    let content = "";

    for (let i = 1; i <= columns; i++) {
      content += `<rect x='${x}%' width='${width}%' height='100%' />`;
      content += `<line x1='${x + width / 2}%' y1='0' x2='${x +
        width / 2}%' y2='100%' />`;

      // draw midline of gutter if not last column
      if (i != columns) {
        x += width;
        content += `<line x1='${x + calcGutter / 2}%' y1='0' x2='${x +
          calcGutter / 2}%' y2='100%' />`;
        x += calcGutter;
      }
    }

    return `<svg xmlns='http://www.w3.org/2000/svg' fill='${color}'>${style} ${content}</svg>`;
  }
}

module.exports = Flegrix;
