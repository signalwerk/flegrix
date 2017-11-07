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
  @include col(5 to 8 of 8, $push: 4); // push is used for flexbox fallback
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


### `container($columncount: 12)`
Set the container to hold columns. `$columncount` defines the count of columns.

```SCSS
.wrap {
  @include container();
}
```

### `col($columncount, $push: 0)`
Set the column width. `$columncount` defines in what column the grid starts/ends (necessary for grid) and `$push` adds a `margin-left` to the column (necessary for flexbox fallback).

```SCSS
.col4of12 {
  @include col(4); // == @include col(1 to 4);
}

.col8of12 {
  @include col(5 to 12);
}


.col2of4 {
  @include col(1 to 2 of 4); // if it's in a container(4)
}

.col2of4-push {
  @include col(2 to 3 of 4, $push: 1); // if it's in a container(4), starts on second column
}
```


## Functions

### `span($columncount)`
Returns the width of the column. `$columncount` is the number of columns to span.  
`$columncount` defines the width (`1 to 4`, `5 to 8`, ...) and can get a context of the parent element (`1 to 4 of 12`, `4 to 6 of 8`, ...).

#### Example
To set the `width` to three columns;
```SCSS
width: span(3); // == span(1 to 3)
```
or in a nested container where the container is 4 columns wide
```SCSS
width: span(1 to 3 of 4); // parent object is container(4)
```

### `gutter($context)`
Returns the width of the gutter in a `$context`.

#### Example
To set a `padding-right` to the gutter-width;
```SCSS
padding-right: gutter();
```
or in a nested container where parent object is `container($context)`.
```SCSS
padding-right: gutter(4); // parent object is container(4)
```



## Status
[![Build Status](https://travis-ci.org/signalwerk/flegrix.svg?branch=master)](https://travis-ci.org/signalwerk/flegrix)
