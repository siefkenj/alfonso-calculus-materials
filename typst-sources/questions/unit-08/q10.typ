#question(title: [Towards FTC], shrink: true)[
  #grid(
    columns: (70%, 30%),
    column-gutter: 1fr,
    align: horizon,
    [#align(center)[#drawing(width: 78mm, {
      let f1(t) = t
      let f2(t) = 1
      let f3(t) = 3 - t
      let f4(t) = -1
      function-graph(
        x: (-1.3, 5.3),
        y: (-2.3, 2.3),
        graph-fn(f1, to: 1),
        graph-fn(f2, from: 1, to: 2),
        graph-fn(f3, from: 2, to: 4),
        graph-fn(f4, from: 4),
        graph-text(3.5, 1.5, color: graph-blue)[$y = f(t)$],
        graph-text(5.15, 0.15, color: graph-red)[$t$],
        graph-text(0.15, 2, color: graph-red)[$y$],
      )
    })]],
    [
      Compute:
      + $display(integral_0^1 f(t) d t)$
      + $display(integral_0^2 f(t) d t)$
      + $display(integral_0^3 f(t) d t)$
      + $display(integral_0^4 f(t) d t)$
      + $display(integral_0^5 f(t) d t)$
    ],
  )
]
