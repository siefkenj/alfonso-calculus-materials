#question(title: [Backwards graphing])[
  Below is the graph of a polynomial $P$.
  Notice that it is not at scale. The
  coordinates in the graph are $a = 24$,
  $b = 25$, and $c = 1$. Find the equation of
  $P$.

  #align(center)[#drawing(width: 74mm, {
    let P(x) = calc.pow(x, 4) * (5 - x) / 256
    function-graph(
      x: (-6.3, 6.3),
      ticks: (10, 10),
      graph-fn(P),
      graph-line((4, -0.2), (4, 0.2), color: graph-red),
      graph-line((5, -0.2), (5, 0.2), color: graph-red),
      graph-line((-0.4, 1), (0.4, 1), color: graph-red),
      graph-text(4, 2)[$y = P(x)$],
      graph-text(4, -0.4)[$a$],
      graph-text(5, -0.4)[$b$],
      graph-text(-0.6, 1)[$c$],
    )
  })]
]
