#question(title: [Quick comparisons: convergent or divergent?])[
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_n^oo (n + 1)/(n^2 + 1))$
      + $display(sum_n^oo (n^2 + 3 n)/(n^4 + 5 n + 1))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      3. $display(sum_n^oo (sqrt(n) + 1)/(n^2 + 1))$
      + $display(sum_n^oo (root(3, n^2 + 1) + 1)/(sqrt(n^3 + n) + n + 1))$
    ],
  )
]
