#question(title: [Derivative from a graph])[
  This is the graph of the function $f$.  \
  Sketch the graph of its derivative $f'$.
  #align(center)[#drawing(width: 78mm, {
    let f1(x) = x * x + 2 * x - 1
    let f2(x) = 3 - x
    let f3(x) = 2 * calc.sqrt(3 - x) - 1
    let f4(x) = -1 - calc.sqrt(x - 3)
    function-graph(
      graph-fn(f1, to: 1),
      graph-fn(f2, from: 1, to: 2),
      graph-fn(f3, from: 2, to: 3),
      graph-fn(f4, from: 3),
      graph-text(2.5, 2.5)[$y = f(x)$],
    )
  })]
]
