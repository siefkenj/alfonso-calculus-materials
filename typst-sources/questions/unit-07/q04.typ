#question(title: [Double sums])[
  Compute:
  #grid(
    columns: 3,
    column-gutter: 1em,
    [
      + $display(sum_(i = 1)^N sum_(k = 1)^N 1)$
      + $display(sum_(i = 1)^N sum_(k = 1)^i 1)$
    ],
    [
      3. $display(sum_(i = 1)^N sum_(k = 1)^i i)$
      + $display(sum_(i = 1)^N sum_(k = 1)^i k)$
    ],
    [
      5. $display(sum_(i = 1)^N sum_(k = 1)^i (i k))$
    ],
  )

  #v(1fr)

  #[
    #set text(size: 10pt)
    Useful formulas:
    $
      & sum_(j = 1)^N j = (N(N + 1))/2 , & & sum_(j = 1)^N j^2 = (N(N + 1)(2 N + 1))/6 , & & sum_(j = 1)^N j^3 = (N^2 (N + 1)^2)/4
    $
  ]
]
