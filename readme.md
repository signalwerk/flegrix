# Flegrix

A tiny grid system to work with flexbox-grids build for PostCSS.

## Installation

Run `npm install --save-dev flegrix` then include in your SCSS:

## Usage

```js
postcss([require("flegrix")]);
```

## Options

### Debug

If you like to have a visual background-image of the columns

```css
/* global settings */
@flegrix {
  debug: true;
}
```

### Overwrite default grid

The default grid has 12 columns with 3% gutter between the columns. By default there is no visual background for grids.

```css
@flegrix grid {
  debug: true; /* default: false */
  columns: 6; /* default: 12 */
  gutter: 2%; /* default: 3% */
  debug-bg-alpha: 0.5; /* default: 0.1 */
}
```

### Setup named grids

```css
/* setting for grid named 'small' */
@flegrix grid small {
  debug: true; /* default: false */
  columns: 6; /* default: 12 */
  gutter: 2%; /* default: 3% */
  debug-bg-alpha: 0.5; /* default: 0.1 */
}
```

## Use (simple)

```HTML
<div class="container">
  <!-- 12 column container -->
  <div class="left">8 columns wide</div>
  <div class="right">4 columns wide, start in column 9</div>
</div>
```

```css
.container {
  @flegrix container;
}

.left {
  @flegrix col {
    from: 1;
    to: 8;
  }
}

.right {
  @flegrix col {
    from: 9;
    to: 12;
  }
}
```

## Use (complex)

```HTML
<div class="container">
  <!-- 12 column container -->
  <div class="left complex">
    <!-- 8 column container -->
    <div class="left-A">4 columns wide in a 8 columns container</div>
    <div class="left-B">4 columns wide in a 8 columns container</div>
    <div class="left-B-push">3 columns wide in a 8 columns container, push 4 columns, append 1 column</div>
  </div>
  <div class="right">4 columns wide, start in column 9</div>
</div>
```

```css
.container {
  @flegrix container;
}

.left {
  @flegrix col {
    from: 1;
    to: 8;
  }
}

.right {
  @flegrix col {
    from: 9;
    to: 12;
  }
}

@flegrix grid complex {
  columns: 8;

  /* you can reference an other grid here */
  gutter: "default";
}

.complex {
  @flegrix container complex;
}

.left-A {
  @flegrix col complex {
    from: 1;
    to: 4;
  }
}

.left-B {
  @flegrix col complex {
    from: 5;
    to: 8;
  }
}

.left-B-push {
  @flegrix col complex {
    from: 5;
    to: 7;
    push: 4;
    append: 1;
  }
}
```

### Status

[![Build Status](https://travis-ci.org/signalwerk/flegrix.svg?branch=master)](https://travis-ci.org/signalwerk/flegrix)
