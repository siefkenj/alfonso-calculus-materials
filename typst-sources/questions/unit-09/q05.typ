#question(title: [Computation practice: Integration by parts])[
  Use integration by parts (possibly in
  combination with other methods) to compute:
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral x e^(-2 x) d x)$
      + $display(integral x^2 sin x thin d x)$
      + $display(integral ln x thin d x)$
      + $display(integral sin sqrt(x) thin d x)$
    ],
    [
      5. $display(integral x arctan x thin d x)$
      + $display(integral x^2 arcsin x thin d x)$
      + $display(integral e^(cos x) sin^3 x thin d x)$
      + $display(integral e^(a x) sin(b x) d x)$
    ],
  )
]
