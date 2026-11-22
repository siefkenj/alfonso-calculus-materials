#question(title: [Rapid questions: convergent or divergent?])[
  #grid(
    columns: 3,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.4cm)
      + $display(integral_1^oo 1/(x^2) thin d x)$
      + $display(integral_1^oo 1/sqrt(x) thin d x)$
      + $display(integral_1^oo 1/x thin d x)$
    ],
    [
      #set enum(spacing: .55em + 0.3cm)
      4. $display(integral_0^1 1/(x^2) thin d x)$
      + $display(integral_0^1 1/sqrt(x) thin d x)$
      + $display(integral_0^1 1/x thin d x)$
    ],
    [
      #set enum(spacing: .55em + 0.3cm)
      7. $display(integral_1^oo 3/(x^2) thin d x)$
      + $display(integral_1^oo 1/(x^2 + 3) thin d x)$
      + $display(integral_1^oo (1/(x^2) + 3) d x)$
    ],
  )
]
