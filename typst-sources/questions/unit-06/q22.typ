#question(title: [Find the coordinates of $P$])[
  $
    f(x) = 3 x + 4 + (2 x - 10)/(x^2)
  $

  #align(center)[#drawing(width: 78mm, {
    // Not to scale: f itself keeps too close to its asymptote to be told apart.
    let asymptote(x) = 3 * x + 4
    let f(x) = asymptote(x) + 300000 * (x - 5) / calc.pow(x, 6)
    function-graph(
      x: (-1.3, 15.3),
      y: (-3.3, 50.3),
      ticks: (100, 100),
      graph-fn(f, from: 4.3, samples: 400),
      graph-fn(asymptote, dash: (10 * graph-px, 5 * graph-px)),
      graph-dot(5, f(5), radius: 4),
      graph-text(7, 35.5)[$y = f(x)$],
      graph-text(5.5, f(5) - 0.6)[$P$],
      graph-text(13, 2.4)[$x$],
      graph-text(-0.45, 45.4)[$y$],
    )
  })]
]
