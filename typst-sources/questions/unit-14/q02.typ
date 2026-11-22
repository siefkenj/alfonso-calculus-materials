#question(title: [Writing functions as power series])[
  You know that #h(1em)
  $display(1/(1 - x) = sum_(n = 0)^oo x^n)$
  #h(1em) for $abs(x) < 1$

  Manipulate it to write the following
  functions as power series centered at 0:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(g(x) = 1/(1 + x))$
      + $display(A(x) = 1/(2 - x))$
         #v(0.5cm)

         #emph[Hint:] Factor
         $display(1 \/ 2)$.
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      3. $display(h(x) = 1/(1 - x^2))$
      + $display(F(x) = ln(1 + x))$
         #v(0.5cm)

         #emph[Hint:] Compute $display(F')$
    ],
  )
]
