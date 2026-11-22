#question(title: [Taylor series gymnastics], shrink: true)[
  #set text(size: 13pt)

  Write the following functions as power
  series centered at $0$. Write them first
  with sigma notation, and then write out the
  first few terms. Indicate the domain where
  each expansion is valid.

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(f(x) = e^(-x))$
      + $display(f(x) = x^2 cos x)$
      + $display(f(x) = 1/(1 + x))$
      + $display(f(x) = 1/(1 - x^2))$
    ],
    [
      5. $display(f(x) = x/(3 + 2 x))$
      + $display(f(x) = sin(2 x^3))$
      + $display(f(x) = (e^x + e^(-x))/2)$
      + $display(f(x) = ln (1 + x)/(1 - x))$
    ],
  )

  #v(0.2cm)

  #emph[Note:] You do not need to take any
  derivatives. You can reduce them all to
  other Maclaurin series you know.
]
