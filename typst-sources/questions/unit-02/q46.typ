#question(title: [Transforming limits], centered: true)[
  The only thing we know about the function
  $g$ is that
  $
    lim_(x -> 0) (g(x))/(x^2) = 2 .
  $
  Use it to compute the following limits:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> 0) (g(x))/x)$
      + $display(lim_(x -> 0) (g(x))/(x^4))$
    ],
    [
      3. $display(lim_(x -> 0) (g(3 x))/(x^2))$
    ],
  )
]
