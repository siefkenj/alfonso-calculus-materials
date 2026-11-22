#question(title: [Computations])[
  Calculate:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> 2) (x^2 + 2 x - 6)/(x^2 + 3 x - 10))$
      + $display(lim_(x -> 0) (e^(2 x^2) - cos x)/(x sin x))$
      + $display(lim_(x -> oo) x^3 e^(-x))$
      + $display(lim_(x -> oo) (e^x + e^(-x))/(e^x - e^(-x)))$
    ],
    [
      5. $display(lim_(x -> 0) thin x sin 2/x)$
      + $display(lim_(x -> oo) x sin 2/x)$
      + $display(lim_(x -> oo) x cos 2/x)$
      + $display(lim_(x -> 1) [(ln x) tan (pi x)/2])$
    ],
  )
]
