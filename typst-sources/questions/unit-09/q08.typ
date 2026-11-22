#question(title: [The error function], shrink: true)[
  The following function is tabulated.
  $
    #text(size: 20pt)[$display(E(x) = integral_0^x e^(-t^2) d t)$] .
  $
  Write the following quantities in terms of
  $E$:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral_1^2 e^(-t^2) d t)$

      + $display(integral_0^x t^2 e^(-t^2) d t)$

      + $display(integral_0^x e^(-2 t^2) d t)$

    ],
    [
      4. $display(integral_0^1 e^(-t^2 + 6 t) d t)$

      + $display(integral_(x_1)^(x_2) e^(-((t - mu)^2)/(sigma^2)) d t)$

      + $display(integral_1^2 (e^(-t))/sqrt(t) d t)$
    ],
  )
]
