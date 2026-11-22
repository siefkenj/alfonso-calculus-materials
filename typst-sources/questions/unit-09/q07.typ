#question(title: [Integrals from a graph])[
  #grid(
    columns: (70%, 32%),
    column-gutter: 1fr,
    align: horizon,
    [#align(center)[
      #only("1")[#drawing(width: 78mm, {
        let f(x) = 1 + calc.pow(x - 1, 2) / 4
        function-graph(
          x: (-1.3, 4.3),
          y: (-1.3, 3.3),
          grid: (0.5, 0.5),
          graph-fn(f, width: 4),
          graph-text(2.5, 2.5, color: graph-blue)[$y = f(x)$],
        )
      })]
      #only("2")[#drawing(width: 78mm, {
        let f(x) = 1 + calc.pow(x - 1, 2) / 4
        function-graph(
          x: (-1.3, 4.3),
          y: (-1.3, 3.3),
          grid: (0.5, 0.5),
          lq.fill-between(lq.linspace(0, 1, num: 100), lq.linspace(0, 1, num: 100).map(f), fill: graph-green, z-index: 0),
          graph-fn(f, width: 4),
          graph-text(2.5, 2.5, color: graph-blue)[$y = f(x)$],
          graph-line((0, 0), (1, 0), color: black, width: 3),
          graph-line((0, f(1)), (1, f(1)), color: black, width: 3),
          graph-line((0, 0), (0, f(0)), color: black, width: 3),
          graph-line((1, 0), (1, f(1)), color: black, width: 3),
        )
      })]
      #only("3")[#drawing(width: 78mm, {
        let f(x) = 1 + calc.pow(x - 1, 2) / 4
        function-graph(
          x: (-1.3, 4.3),
          y: (-1.3, 3.3),
          grid: (0.5, 0.5),
          lq.fill-between(lq.linspace(0, 3, num: 100), lq.linspace(0, 3, num: 100).map(f), fill: graph-green, z-index: 0),
          graph-fn(f, width: 4),
          graph-text(2.5, 2.5, color: graph-blue)[$y = f(x)$],
          graph-line((0, 0), (3, 0), color: black, width: 3),
          graph-line((0, f(1)), (3, f(1)), color: black, width: 3),
          graph-line((0, 0), (0, f(0)), color: black, width: 3),
          graph-line((1, 0), (1, f(1)), color: black, width: 3),
          graph-line((2, 0), (2, f(2)), color: black, width: 3),
          graph-line((3, 0), (3, f(3)), color: black, width: 3),
        )
      })]
    ]],
    [
      Estimate:
      + $display(integral_0^1 f(x) d x)$
      + $display(integral_0^1 f' (x) d x)$
      + $display(integral_0^3 x thin f' (x) d x)$
      + $display(integral_0^1 f(3 x) d x)$
    ],
  )
]
