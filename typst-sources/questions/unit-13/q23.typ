#question(title: [Slow comparisons: convergent or divergent?])[
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_n^oo (2^n - 40)/(3^n - 20))$
      + $display(sum_n^oo ((ln n)^20)/(n^2))$
      + $display(sum_n^oo sin^2 1/n)$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      4. $display(sum_n^oo 1/(n thin(ln n)^3))$
      + $display(sum_n^oo 1/(n thin ln n))$
      + $display(sum_n^oo e^(-n^2))$
    ],
  )
]
