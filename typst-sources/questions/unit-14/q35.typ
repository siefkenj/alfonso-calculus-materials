#question(title: [Add more series])[
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      5. $display(sum_(n = 1)^oo n/(3^n))$
      + $display(sum_(n = 1)^oo (n^2)/(3^n))$
      + $display(sum_(n = 0)^oo (x^(n + 2))/((n + 1)(n + 2)))$
    ],
    [
      8. $display(sum_(n = 0)^oo (x^n)/((n + 2) n!))$
      + $display(sum_(n = 0)^oo (- 1)^n ((n + 1))/((2 n)!) thin 2^n)$
      + $display(sum_(n = 0)^oo ((- 1)^n)/((2 n + 1) 3^n))$
    ],
  )

  #v(0.5cm)

  #emph[Hint:] Take derivatives or
  antiderivatives of series whose values you
  know.
]
