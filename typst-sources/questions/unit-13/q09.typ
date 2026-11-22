#question(title: [Geometric series], shrink: true)[
  #set text(size: 13pt)

  Calculate the value of the following
  series:

  #set enum(spacing: .55em + 0.5cm)
  + $display(1 + 1/3 + 1/9 + 1/27 + 1/81 + ...)$
  + $display(1/2 - 1/4 + 1/8 - 1/16 + 1/32 - ...)$
  + $display(3/2 - 9/4 + 27/8 - 81/16 + ...)$
  + $display(1 + 1/(2^0.5) + 1/2 + 1/(2^1.5) + 1/(2^2) + 1/(2^2.5) + ...)$

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      5. $display(sum_(n = 1)^oo (- 1)^n (3^n)/(2^(2 n + 1)))$
    ],
    [
      6. $display(sum_(n = k)^oo x^n)$
    ],
  )
]
