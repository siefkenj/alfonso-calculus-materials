#question(title: [Towards FTC (continued)], shrink: true)[
  #set text(size: 13pt)

  #align(center)[#drawing(width: 8cm, height: 5cm, {
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
  })]

  Call
  $display(F(x) = integral_0^x f(t) d t)$.
  This is a new function.
  - Sketch the graph of $display(y = F(x))$.
  - Using the graph you just sketched, sketch
    the graph of $display(y = F' (x))$.
]
