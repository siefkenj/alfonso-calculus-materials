#question(title: [Backwards graphing])[
  $R$ is a rational function (a quotient of
  polynomials).  \
  Find its equation.
  #align(center)[#drawing(width: 78mm, {
    let (a, b) = (1, -2)
    let R(x) = 2 * calc.pow(x + 1, 3) / ((x - a) * calc.pow(x - b, 2))
    let asymptote(x) = 2
    let gap = 0.0001
    function-graph(
      x: (-6.3, 4.3),
      y: (-6.3, 8.3),
      ticks: (1, 2),
      ..((auto, b - gap), (b + gap, a - gap), (a + gap, auto)).map(((from, to)) => graph-fn(
        R,
        from: from,
        to: to,
        samples: 800,
        width: 3,
      )),
      graph-fn(asymptote, color: graph-red, dash: (10 * graph-px, 5 * graph-px)),
      graph-line((a, -10), (a, 10), color: graph-red, dash: (10 * graph-px, 5 * graph-px)),
      graph-line((b, -10), (b, 10), color: graph-red, dash: (10 * graph-px, 5 * graph-px)),
      graph-text(-4.5, 6, size: 36, color: graph-blue)[$y = R(x)$],
    )
  })]
]
