# Flegrix
A tiny grid system to work with css-grid. By default it also includes a flexbox fallback for IE10+ and other browsers not supporting css-grid.


The system holds basically the following helpers;

```SCSS
// mixins
@include container($columncount);
@include col($columncount, $push: 0);

// Functions
$myColumnVar: span($columncount);
$myGutterVar: gutter($context);
```

## Use (simple)

```HTML
<div class="container">
  <!-- 12 column container -->
  <div class="left">8 columns wide</div>
  <div class="right">4 columns wide, start in column 9</div>
</div>
```

```SCSS
.container {
  @include container();
}

.left {
  @include col(1 to 8);
}

.right {
  @include col(9 to 12);
}
```

## Use (complex)

```HTML
<div class="container">
  <div class="left complex">
    <!-- 12 column container -->
    <div class="left-A">4 columns wide in a 8 columns container</div>
    <div class="left-B">4 columns wide in a 8 columns container</div>
    <!-- if the column is not filled: -->
    <div class="left-B-push">4 columns wide in a 8 columns container, push 4 columns</div>
  </div>

  <div class="right">4 columns wide, start in column 9</div>
</div>
```

```SCSS
.complex {
  @include container(8);
}

.left-A {
  @include col(1 to 4 of 8);
}

.left-B {
  @include col(5 to 8 of 8);
}

.left-B-push {
  @include col(5 to 8 of 8, $push: 4);
}
```

## Installation
Run `npm install --save-dev flegrix` then include in your SCSS:

```SCSS
@import "~flegrix/flegrix.scss";
```


## Settings
If you like to overwrite the default settings define a map called `$flegrix-grid`.

```SCSS
$flegrix-grid: (
  columns: 12, // column-count → default: 12
  gutter: 3%, // gutter between columns → default: 3%
  IE-flexbox-fallback: true, // flexbox fallback for IE10+ → default: true
  flexbox-fallback: true, // flexbox fallback for other browsers than IE10+ → default: true
  debug: false, // debug-mode → default: false
  debug-display: 'flex', // shows in debug-mode with displa flex|grid → default: flex
  debug-container-column-background: true, // draw column in debug-mode → default: true
  debug-container-column-midline: false, // draw column-midline in debug-mode → default: false
  debug-container-gutter-midline: false, // draw gutter-midline in debug-mode → default: false
);
```

## Mixins


### `container($columncount)`
Set the parent wrap to use flexbox. `$columncount` takes the default if not defined. the `$columncount` is only for debug purpose important.

```SCSS
.wrap {
  @include container();
}
```

### `col($columncount, $push: 0)`
Set the column width with flexbox and grid. `$columncount` defines in what column the grid starts (necessary for grid) and `$push` adds a `margin-left` to the column (necessary if in flexbox the width is not already used before the column).

```SCSS
.col4of12 {
  @include col(4); // == @include col(1 zo 4);
}

.col8of12 {
  @include col(5 to 12);
}
```


## Functions

### `span($columncount)`
Returns the width of the column. `$columncount` is the number of columns to span.  
`$columncount` can be an number (`1`, `2`, `3`, ...) or a number of columns in and a context of columns (`1 of 12`, `4 of 6`, ...).
#### Example
To set the `width` to three columns;
```SCSS
width: span(3);
```
or in a nested container where the container is 4 columns wide
```SCSS
width: span(1 to 3 of 4); // parent object = width: span(4);
```

### `gutter($context)`
Returns the width of the gutter in a `$context`.
#### Example
To set a `padding-right` to the gutter-width;
```SCSS
padding-right: gutter();
```
or in a nested container where the container is 4 columns wide use `$context`.
```SCSS
padding-right: gutter(4);
```



### Status
[![Build Status](https://travis-ci.org/signalwerk/flegrix.svg?branch=master)](https://travis-ci.org/signalwerk/flegrix)
