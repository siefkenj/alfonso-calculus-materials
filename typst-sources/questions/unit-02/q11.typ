#question(title: [$delta$ from a graph])[
  #set text(size: 11pt)

  #align(center)[#drawing(width: 58mm, {
    let f1(x) = x
    let f2(x) = 2 + (x - 2) / 2
    function-graph(
      x: (-0.8, 5.3),
      y: (-0.8, 4.3),
      graph-fn(f1, to: 2),
      graph-fn(f2, from: 2),
      graph-dot(2, f1(2), open: true),
      graph-text(3, 3.5, size: 40, color: graph-blue)[$y = f(x)$],
    )
  })]

  + Find one value of $delta > 0$ s.t.
    #h(1fr)
    $display(0 < abs(x - 2) < delta ==> abs(f(x) - 2) < 0.5)$
  + Find #emph[all] values of $delta > 0$
    s.t. #h(1fr)
    $display(0 < abs(x - 2) < delta ==> abs(f(x) - 2) < 0.5)$
]
