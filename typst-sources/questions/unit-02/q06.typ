#question(title: [More limits from a graph], centered: true)[
  #grid(
    columns: (65%, 33%),
    column-gutter: 1fr,
    align: horizon,
    [#drawing(width: 78mm, {
      let g1(x) = calc.pow(calc.sin(calc.pi / (4 * x * x)), 2)
      let g2(x) = 2 - x
      function-graph(
        x: (-2.3, 2.3),
        y: (-1.3, 2.3),
        ..((-2.5, -0.5, 2), (-0.5, -0.3, 2), (-0.31, -0.2, 1), (-0.21, -0.1, 1), (-0.11, -0.04, 1), (-0.04, -0.01, 1)).map((
          (from, to, width),
        ) => graph-fn(g1, from: from, to: to, width: width)),
        graph-fn(g2, from: 0, to: 3),
        graph-dot(0, g2(0), open: true),
        // g(0), apart from both pieces.
        graph-dot(0, 1.5),
        graph-text(-1.5, 1.5)[$y = g(x)$],
      )
    })],
    [
      Find the value of
      + $display(lim_(x -> 0^+) g(x))$
      + $display(lim_(x -> 0^+) thick floor(g(x)))$
      + $display(lim_(x -> 0^+) g(floor(x)))$
      + $display(lim_(x -> 0^-) g(x))$
      + $display(lim_(x -> 0^-) thick floor(g(x)))$
      + $display(lim_(x -> 0^-) thick floor((g(x))/2))$
      + $display(lim_(x -> 0^-) g(floor(x)))$
    ],
  )
]
