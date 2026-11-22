#question(title: [Rapid questions: alternating series test])[
  Convergent or divergent?

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_(n = 1)^oo 1/(n^0.5))$
      + $display(sum_(n = 1)^oo 1/(n^3))$
      + $display(sum_(n = 1)^oo 1/(sin n))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      4. $display(sum_(n = 1)^oo ((- 1)^n)/(n^0.5))$
      + $display(sum_(n = 1)^oo ((- 1)^n)/(n^3))$
      + $display(sum_(n = 1)^oo ((- 1)^n)/(sin n))$
    ],
  )
]
