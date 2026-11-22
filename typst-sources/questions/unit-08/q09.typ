#question(title: [Functions defined by integrals])[
  #set text(size: 11pt)

  Which ones of these are valid ways to
  define functions?

  #v(0.1cm)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.3cm)
      + $display(F(x) = integral_0^x t/(1 + t^8) thick d t)$
      + $display(F(x) = integral_0^x x/(1 + x^8) thick d x)$
      + $display(F(x) = integral_0^x x/(1 + t^8) thick d t)$
      + $display(F(x) = integral_0^(x^2) t/(1 + t^8) thick d t)$
    ],
    [
      #set enum(spacing: .55em + 0.3cm)
      5. $display(F(x) = integral_(sin x)^(e^x) t/(1 + t^8) thick d t)$
      + $display(F(x) = integral_0^3 t/(1 + x^2 + t^8) thick d t)$
      + $display(F(x) = x integral_(sin x)^(e^x) t/(1 + x^2 + t^8) thick d t)$
      + $display(F(x) = t integral_(sin x)^(e^x) t/(1 + x^2 + t^8) thick d t)$
    ],
  )
]
