#question(title: [Riemann sums backwards])[
  Interpret the following limits as
  integrals:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(n -> oo) sum_(i = 1)^n 1/n sin i/n)$
    ],
    [
      2. $display(lim_(n -> oo) sum_(i = 1)^n (n + i)/(n^2))$
    ],
  )

  #[
    #set text(size: 10pt)
    #emph[Hint:] Let $f$ be a continuous
    function on $[0, 1]$. Write a formula for
    $display(integral_0^1 f(x) d x)$ as a
    limit of Riemann sums, making the
    simplest choices you can.
  ]
]
