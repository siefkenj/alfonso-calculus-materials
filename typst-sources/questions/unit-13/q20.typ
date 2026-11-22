#question(title: [Rapid questions: improper integrals])[
  Convergent or divergent?

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(integral_1^oo 1/(x^2) thin d x)$
      + $display(integral_1^oo 1/x thin d x)$
      + $display(integral_1^oo 1/sqrt(x) thin d x)$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      4. $display(integral_1^oo (x + 1)/(x^3 + 2) thin d x)$
      + $display(integral_1^oo sqrt(x^2 + 5)/(x^2 + 6) thin d x)$
      + $display(integral_1^oo (x^2 + 3)/sqrt(x^5 + 2) thin d x)$
    ],
  )
]
