#question(title: [Find the coordinates of $P$ and $Q$])[
  $
    g(x) = x^4 - 6 x^2 + 9
  $

  #align(center)[#drawing(width: 78mm, {
    let g(x) = calc.pow(x, 4) - 6 * x * x + 9
    let dg(x) = 4 * calc.pow(x, 3) - 12 * x
    // g(x) = g(p) is a quadratic in x² whose roots add up to 6.
    let p = -1
    let q = calc.sqrt(6 - p * p)
    let level(x) = g(p)
    let tangent(x) = g(p) + dg(p) * (x - p)
    function-graph(
      x: (-3.3, 3.3),
      y: (-1.3, 15.3),
      ticks: (5, 20),
      graph-fn(g),
      graph-fn(level, dash: (10 * graph-px, 5 * graph-px)),
      graph-fn(tangent, dash: (10 * graph-px, 5 * graph-px)),
      graph-dot(p, g(p), radius: 4, color: black),
      graph-dot(q, g(q), radius: 4, color: black),
      graph-text(-1, 12)[$y = g(x)$],
      graph-text(p + 0.1, g(p) - 0.7)[$P$],
      graph-text(q + 0.11, g(q) - 0.7)[$Q$],
    )
  })]
]
