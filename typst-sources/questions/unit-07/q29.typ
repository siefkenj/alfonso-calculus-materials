#question(title: [Properties of the integral], centered: true, shrink: true)[
  #set text(size: 13pt)

  Assume we know the following
  $
    & integral_0^2 f(x) d x = 3, & & integral_0^4 f(x) d x = 9, & & integral_0^4 g(x) d x = 2 .
  $

  Compute:
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral_0^2 f(t) d t)$
      + $display(integral_0^2 f(x) d x)$
      + $display(integral_0^2 f(t) d x)$
      + $display(integral_2^0 f(x) d x)$
    ],
    [
      5. $display(integral_2^4 f(x) d x)$
      + $display(integral_(-2)^0 f(x) d x)$
      + $display(integral_0^4 [f(x) - 2 g(x)] thick d x)$
    ],
  )

  #v(.5em)
]
