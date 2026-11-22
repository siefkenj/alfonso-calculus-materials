#question(title: [Rapid questions: geometric series])[
  Convergent or divergent?

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_(n = 0)^oo 1/(2^n))$
      + $display(sum_(n = 1)^oo ((- 1)^n)/(2^n))$
      + $display(sum_(n = 1)^oo 1/(2^(n \/ 2)))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      4. $display(sum_(n = 5)^oo (3^n)/(2^(2 n + 1)))$
      + $display(sum_(n = 3)^oo (3^n)/(1000 dot.op 2^(n + 2)))$
      + $display(sum_(n = 0)^oo (- 1)^n)$
    ],
  )
]
