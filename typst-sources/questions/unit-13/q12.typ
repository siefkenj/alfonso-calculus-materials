#question(title: [Functions as series])[
  #set text(size: 13pt)

  You know that when $abs(x) < 1$:

  $
    f(x) = 1/(1 - x) = sum_(n = 0)^oo x^n
  $
  Find similar ways to write the following
  functions as series:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(g(x) = 1/(1 + x))$
      + $display(h(x) = 1/(1 - x^2))$
    ],
    [
      3. $display(A(x) = 1/(2 - x))$
      + $display(G(x) = ln(1 + x))$
    ],
  )

  #v(0.2cm)
  #emph[Hint:] For the last one, compute
  $G'$.
]
