# flegrix
A tiny grid system to work with css-flexbox and css-grid.
The system holds basically the following helpers;

```SCSS
// mixins
@include container($columncount);
@include col($count, $start: 1, $push: 0);

// Functions
span($columncount);
gutter($context):
```

## installation
Run `npm install --save-dev flegrix` then include in your SCSS:

```SCSS
@import "~flegrix/flegrix.scss";
```


## variables
If you like to overwrite the default settings define a map called `$flegrix-grid`.

```SCSS
$flegrix-grid: (
  columns: 12, // column-count → default: 12
  gutter: 3%, // gutter between columns → default: 3%
  debug: false, // debug-mode → default: false
  debug-display: 'flex', // shows in debug-mode with displa flex|grid → default: flex
  debug-container-column-background: true, // draw column in debug-mode → default: true
  debug-container-column-midline: false, // draw column-midline in debug-mode → default: false
  debug-container-gutter-midline: false, // draw gutter-midline in debug-mode → default: false
);
```

## mixins


### `container($columncount)`
Set the parent wrap to use flexbox. `$columncount` takes the default if not defined. the `$columncount` is only for debug purpose important.

```SCSS
.wrap {
  @include container();
}
```

### `col($count, $start: 1, $push: 0)`
Set the column width with flexbox and grid. `$start` defines in what column the grid starts (necessary for grid) and `$push` adds a `margin-left` to the column (necessary if in flexbox the width is not already used before the column).

```SCSS
.col4of12 {
  @include col(4);
}

.col8of12 {
  @include col(8, $start: 5);
}
```


## functions

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
width: span(3 of 4); // parent object = width: span(4);
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

### ToDo
* Add more Documentation
