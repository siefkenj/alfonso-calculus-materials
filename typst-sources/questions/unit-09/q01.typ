#question(title: [Computation practice: integration by substitution])[
  Use substitutions to compute:
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral (sin sqrt(x))/sqrt(x) d x)$
      + $display(integral e^x cos(e^x) d x)$
      + $display(integral cot x thin d x)$
      + $display(integral x^2 sqrt(x + 1) thin d x)$
    ],
    [
      5. $display(integral (e^(2 x))/sqrt(e^x + 1) thin d x)$
      + $display(integral ((ln ln x)^2)/(x ln x) thin d x)$
      + $display(integral x e^(-x^2) thin d x)$
      + $display(integral e^(-x^2) thin d x)$
    ],
  )
]
