#flegrix
A tiny grid system to work with flexbox.
The system holds basically the following helpers;

## functions

### `span($columncount)`
To set the `width` to three columns;
```SCSS
  width: span(3);
```
or if you wanna wrap in different context:
```SCSS
  width: span(3 of 4); // parent object = width: span(4);
```

### `gutter($count)`
To set a `padding-right` to the gutter-width;
```SCSS
  padding-right: gutter();
```
or
```SCSS
  padding-right: gutter(1 of 4);
```

## mixins


### `container()`
Set the parent wrap to use flexbox.
```SCSS
.wrap {
  @include container();
}
```


### `col($count)`
Set the column width with flexbox.

```SCSS
.col4of12 {
  @include col(4);
}

.col8of12 {
  @include col(8);
}
```
