#question(title: [Inverse function from a graph], centered: true)[
  #grid(
    columns: (65%, 30%),
    column-gutter: 1fr,
    align: horizon,
    [#drawing(width: 78mm, {
      let f1(x) = x - 1
      let f2(x) = 2 * x
      function-graph(
        y: (-3.3, 5.3),
        graph-fn(f1, from: -1, to: 0),
        graph-fn(f2, from: 0, to: 2),
        graph-dot(-1, f1(-1), radius: 4),
        graph-dot(0, f1(0), radius: 4),
        graph-dot(0, f2(0), radius: 4, open: true),
        graph-dot(2, f2(2), radius: 4),
        graph-text(-2.5, 2.5)[$y = f(x)$],
      )
    })],
    [
      Calculate:
      + $display(f(2))$
      + $display(f(0))$
      + $display(f^(-1) (2))$
      + $display(f^(-1) (0))$
      + $display(f^(-1) (- 1))$
    ],
  )
]
