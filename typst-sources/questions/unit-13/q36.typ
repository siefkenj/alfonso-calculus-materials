#question(title: [Quick review: Convergent or divergent?])[
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_n^oo (1.1)^n)$
      + $display(sum_n^oo (0.9)^n)$
      + $display(sum_n^oo 1/(n^1.1))$
      + $display(sum_n^oo 1/(n^0.9))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      5. $display(sum_n^oo ((- 1)^n)/(ln n))$
      + $display(sum_n^oo ((- 1)^n)/(e^(1 \/ n)))$
      + $display(sum_n^oo (n^3 + n^2 + 11)/(n^4 + 2 n - 3))$
      + $display(sum_n^oo sqrt(n^5 + 2 n + 16)/(n^4 - 11 n + 7))$
    ],
  )
]
