class Flegrix {
  constructor() {
    this.mode = "flexbox";
    this.presets = {
      default: {
        debug: false,
        columns: 12,
        gutter: 3
      },
      standard: {
        debug: false,
        columns: 12,
        gutter: 3
      }
    };
  }

  preset(root) {
    let conf = {
      debug: this.presets.default.debug,
      columns: this.presets.default.columns,
      gutter: this.presets.default.gutter
    };
    root.walkDecls("debug", decl => {
      if (`${decl.value}`.toLowerCase().includes("true")) {
        conf.debug = true;
      } else {
        conf.debug = false;
      }
    });

    root.walkDecls("columns", decl => {
      conf.columns = parseFloat(decl.value, 10);
    });

    root.walkDecls("gutter", decl => {
      let gutterValue = `${decl.value}`.replace(/["'%]/g, "");
      conf.gutter = parseFloat(gutterValue, 10);
    });

    root.walkDecls("gutter", decl => {
      let gutterValue = `${decl.value}`.replace(/["'%]/g, "");
      // if the gutter is a reference to an other grid
      if (this.presets[gutterValue]) {
        conf.gutter =
          (this.presets[gutterValue].gutter / conf.columns) *
          this.presets[gutterValue].columns;
      } else {
        conf.gutter = parseFloat(gutterValue, 10);
      }
    });

    return conf;
  }

  default(root) {
    let config = this.preset(root);
    this.presets.default.debug = config.debug;
    this.presets.default.columns = config.columns;
    this.presets.default.gutter = config.gutter;
  }

  grid(preset, root) {
    let config = this.preset(root);
    this.presets[preset] = this.presets[preset] || {};
    this.presets[preset].debug = config.debug;
    this.presets[preset].columns = config.columns;
    this.presets[preset].gutter = config.gutter;
  }

  col(preset, root) {
    if (!this.presets[preset]) {
      throw root.error("Unknown preset " + preset, { plugin: "flegrix" });
    }

    let config = {
      from: 1,
      to: 2,
      push: 0,
      append: 0,
      gutter: this.presets[preset].gutter,
      columns: this.presets[preset].columns
    };

    root.walkDecls("from", decl => {
      config.from = parseFloat(decl.value, 10);
    });
    root.walkDecls("to", decl => {
      config.to = parseFloat(decl.value, 10);
    });
    root.walkDecls("push", decl => {
      config.push = parseFloat(decl.value, 10);
    });
    root.walkDecls("append", decl => {
      config.append = parseFloat(decl.value, 10);
    });

    let css = [];

    css.push({
      prop: "flex-grow",
    });
    css.push({
      prop: "flex-shrink",
      value: "1"
    });
    css.push({
      prop: "flex-basis",
      value: `${this.span(config)}%`
    });
    css.push({
      prop: "max-width",
      value: `${this.span(config)}%`
    });
    if (config.push && config.push !== 0) {
      css.push({
        prop: "margin-left",
        value: `${this.push({
          from: 1,
          to: config.push,
          columns: config.columns,
          gutter: config.gutter
        })}%`
      });
    }
    if (config.append && config.append !== 0) {
      css.push({
        prop: "margin-right",
        value: `${this.append({
          from: 1,
          to: config.append,
          columns: config.columns,
          gutter: config.gutter
        })}%`
      });
    }
    return css;
  }

  append(config) {
    return this.span(config) + config.gutter;
  }

  push(config) {
    return this.span(config) + config.gutter;
  }

  // get the width
  // span(4) == span(1 to 4 of 12)
  span(config) {
    let { from, to, columns, gutter } = config;
    let colCount = to - from + 1;
    let totalColumnWidth = 100 - gutter * (columns - 1);

    let width =
      (totalColumnWidth / columns) * colCount + gutter * (colCount - 1);

    return width;
  }

  container(preset, root) {
    if (!this.presets[preset]) {
      throw root.error("Unknown preset " + preset, { plugin: "flegrix" });
    }

    let config = this.presets[preset];

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
          this.svg(preset, config)
        )}")`
      });
    }

    return css;
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

  //https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
  toColor(name) {
    let colors = [
      "rgba(229, 28, 35, 0.07)",
      "rgba(233, 30, 99, 0.07)",
      "rgba(156, 39, 176, 0.07)",
      "rgba(103, 58, 183, 0.07)",
      "rgba(63, 81, 181, 0.07)",
      "rgba(86, 119, 252, 0.07)",
      "rgba(3, 169, 244, 0.07)",
      "rgba(0, 188, 212, 0.07)",
      "rgba(0, 150, 136, 0.07)",
      "rgba(37, 155, 36, 0.07)",
      "rgba(139, 195, 74, 0.07)",
      "rgba(175, 180, 43, 0.07)",
      "rgba(255, 152, 0, 0.07)",
      "rgba(255, 87, 34, 0.07)",
      "rgba(121, 85, 72, 0.07)",
      "rgba(96, 125, 139, 0.07)"
    ];

    var hash = 0;
    if (name.length === 0) return hash;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
  }

  svg(preset, config) {
    let { columns, gutter } = config;

    let color = this.toColor(preset); //"rgba(255,0,0,0.07)";
    let lineColor = "rgba(128,0,0,0.05)";
    let width = this.span({ from: 1, to: 1, columns, gutter });

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
        content += `<line x1='${x + gutter / 2}%' y1='0' x2='${x +
          gutter / 2}%' y2='100%' />`;
        x += gutter;
      }
    }

    return `<svg xmlns='http://www.w3.org/2000/svg' fill='${color}'>${style} ${content}</svg>`;
  }
}

module.exports = Flegrix;
