#question(title: [Limits from a graph], centered: true)[
  #grid(
    columns: (65%, 33%),
    column-gutter: 1fr,
    align: horizon,
    [#drawing(width: 78mm, {
      let f1(x) = 2
      let f2(x) = 1 + calc.pow(x + 1, 2)
      let f3(x) = -2 * x + 2
      let f4(x) = -2 * x + 6
      function-graph(
        graph-fn(f1, to: -2),
        graph-fn(f2, from: -2, to: 0),
        graph-fn(f3, from: 0, to: 2),
        graph-fn(f4, from: 2, to: 4),
        graph-dot(2, f4(2), open: true),
        graph-dot(2, f3(2), open: true),
        // f(2), apart from both pieces.
        graph-dot(2, -1),
        graph-text(-2.5, -1.5, size: 36)[$y = f(x)$],
      )
    })],
    [
      Find the value of
      + $display(lim_(x -> 2) f(x))$
      + $display(lim_(x -> 0) f(f(x)))$
      + $display(lim_(x -> 2) [f(x)]^2)$
      + $display(lim_(x -> 0) f(2 cos x))$
    ],
  )
]
