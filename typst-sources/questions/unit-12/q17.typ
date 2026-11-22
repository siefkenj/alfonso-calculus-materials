#question(title: [Slow questions: convergent or divergent?])[
  #set text(size: 13pt)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.4cm)
      + $display(integral_1^oo (x^3 + 2 x + 7)/(x^5 + 11 x^4 + 1) thin d x)$
      + $display(integral_1^oo 1/sqrt(x^2 + x + 1) thin d x)$
      + $display(integral_0^1 (3 cos x)/(x + sqrt(x)) thin d x)$
      + $display(integral_0^1 sqrt(cot x) thin d x)$
    ],
    [
      #set enum(spacing: .55em + 0.4cm)
      5. $display(integral_0^1 (sin x)/(x^(3 \/ 2)) thin d x)$
      + $display(integral_0^oo e^(-x^2) d x)$
      + $display(integral_2^oo ((ln x)^10)/(x^2) thin d x)$
    ],
  )
]
