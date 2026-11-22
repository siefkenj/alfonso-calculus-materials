#question(title: [Worm up])[
  A worm is crawling accross the table. The
  path of the worm looks something like this:

  #align(center)[#drawing(width: 58mm, {
    let x(t) = calc.sin(t) + t / 2
    let y(t) = calc.cos(t)
    function-graph(
      axes: false,
      grid: none,
      graph-curve(x, y, -3 * calc.pi, 3 * calc.pi),
    )
  })]
  // The drawing has much empty space below the curve (as in the LaTeX).
  #v(-1cm)

  #slide-block(title: [True or False?])[The position of the worm is a function.]
]
