#question(title: [A telescopic series])[
  #set text(size: 13pt)
  I want to calculate the value of the series
  #h(.25em)
  $display(sum_(n = 1)^oo 1/(n^2 + 2 n) .)$
  #v(0.5cm)

  #set enum(spacing: .55em + 0.5cm)
  + Find a formula for the $k$-th partial sum
    $display(S_k = sum_(n = 1)^k 1/(n^2 + 2 n) .)$

     #emph[Hint:] #h(.25em)
     $display(1/(n^2 + 2 n) thick = thick A/n + B/(n + 2))$
  + Using the definition of series, compute
    the value of
     $
       sum_(n = 1)^oo 1/(n^2 + 2 n)
     $
]
