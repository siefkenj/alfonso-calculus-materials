#question(title: [From the derivative to the function])[
  + Sketch the graph of a continuous function
    with domain $RR$, whose derivative has
    the graph below.
  + Sketch the graph of a non-continuous
    function whose derivative has the graph
    below.

  #align(center)[#drawing(width: 58mm, {
    let f(x) = 1 / (2 * x)
    function-graph(
      ticks: (5, 5),
      graph-fn(f, to: -0.001),
      graph-fn(f, from: 0.001),
    )
  })]
]
