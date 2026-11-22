#question(title: [Suprema from a graph])[
  #set text(size: 13pt)

  Calculate, for the function $g$ on the
  interval $[0.5, 1.5]$:

  #grid(
    columns: 4,
    column-gutter: 1em,
    [
      + supremum
    ],
    [
      2. infimum
    ],
    [
      3. maximum
    ],
    [
      4. minimum
    ],
  )

  #align(center)[#drawing(width: 68mm, {
    let g1(x) = x
    let g2(x) = 1 - x
    function-graph(
      x: (-0.3, 2.3),
      y: (-1.3, 1.3),
      graph-fn(g1, from: 0, to: 1),
      graph-fn(g2, from: 1, to: 2),
      graph-dot(1, g1(1), radius: 8, open: true),
      graph-dot(1, g2(1), radius: 8),
      graph-dot(0, g1(0), radius: 8),
      graph-dot(2, g2(2), radius: 8),
      graph-text(1.78, 0.5, size: 40, color: graph-blue, align: right + horizon)[$y = g(x)$],
    )
  })]
]
