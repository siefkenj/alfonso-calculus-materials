#question(title: [Ratio Test: Convergent or divergent?])[
  Use Ratio Test to decide which series are
  convergent.

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_(n = 1)^oo (3^n)/(n!))$
      + $display(sum_(n = 1)^oo ((2 n)!)/((n!)^2 thick 3^(n + 1)))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      3. $display(sum_(n = 2)^oo (n!)/(n^n))$
      + $display(sum_(n = 2)^oo 1/(ln n))$
    ],
  )
]
