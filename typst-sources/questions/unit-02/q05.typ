#question(title: [Floor])[
  Given a real number $x$, we defined the
  #emph[floor of $x$], denoted by $floor(x)$,
  as the largest integer smaller than or
  equal to $x$. For example:
  $
    floor(pi) = 3, quad quad floor(7) = 7, quad quad floor(- 0.5) = - 1 .
  $
  Sketch the graph of
  $display(y = floor(x))$. Then compute:
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> 0^+) floor(x))$
      + $display(lim_(x -> 0^-) floor(x))$
    ],
    [
      3. $display(lim_(x -> 0) thick floor(x))$
      + $display(lim_(x -> 0) thick floor(x^2))$
    ],
  )
]
