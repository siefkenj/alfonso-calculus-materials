#question(title: [Worm function], shrink: true)[
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
  #v(-1.2cm)

  A worm is crawling accross the table.  \
  For any time $t$, let $f(t)$ be the
  position of the worm.  \
  This defines a function $f$.

  + What is the domain of $f$?
  + What is the codomain of $f$?
  + What is the range of $f$?
]
