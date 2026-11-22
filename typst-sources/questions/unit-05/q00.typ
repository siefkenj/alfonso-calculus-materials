#question(title: [Definition of local extremum], centered: true)[
  Find local and global extrema of the
  function with this graph:

  #align(center)[#drawing(width: 81mm, {
    let f1(x) = 1 + calc.pow(x - 2, 2)
    let f2(x) = 1 + 2 * calc.pow(x - 2, 2)
    let f3(x) = 3 - (x - 3)
    let f4(x) = 3 - calc.pow(x - 5, 2)
    let f5(x) = 3 - calc.pow(x - 5, 2) / 2
    let f6(x) = 2.5
    let f7(x) = 2.5 - (x - 7)
    let f8(x) = 3 - (x - 8)
    function-graph(
      x: (-0.3, 10.3),
      y: (-0.6, 5.3),
      labels: (true, false),
      graph-fn(f1, from: 0, to: 2),
      graph-fn(f2, from: 2, to: 3),
      graph-fn(f3, from: 3, to: 4),
      graph-fn(f4, from: 4, to: 5),
      graph-fn(f5, from: 5, to: 6),
      graph-fn(f6, from: 6, to: 7),
      graph-fn(f7, from: 7, to: 8),
      graph-fn(f8, from: 8, to: 9),
      graph-dot(0, f1(0), radius: 4),
      graph-dot(4, f3(4), radius: 4, open: true),
      // f(4), apart from both pieces.
      graph-dot(4, 2.5, radius: 4),
      graph-dot(8, f7(8), radius: 4),
      graph-dot(8, f8(8), radius: 4, open: true),
      graph-dot(9, f8(9), radius: 4),
    )
  })]
]
