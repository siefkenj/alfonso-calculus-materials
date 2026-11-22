#question(title: [BCT calculations])[
  Use BCT to determine whether each of the
  following is convergent or divergent

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.3cm)
      + $display(integral_1^oo (1 + cos^2 x)/(x^(2 \/ 3)) thin d x)$
      + $display(integral_1^oo (1 + cos^2 x)/(x^(4 \/ 3)) thin d x)$
      + $display(integral_0^oo (arctan x^2)/(1 + e^x) thin d x)$
    ],
    [
      #set enum(spacing: .55em + 0.3cm)
      4. $display(integral_0^oo e^(-x^2) d x)$
      + $display(integral_2^oo ((ln x)^10)/(x^2) thin d x)$
    ],
  )
]
