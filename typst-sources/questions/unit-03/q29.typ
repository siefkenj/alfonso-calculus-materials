#question(title: [Chain rule from a graph], centered: true, shrink: true)[
  If $f$ and $g$ are the functions whose
  graphs are shown.  \
  Let $u(x) = f(g(x))$ and $v(x) = g(f(x))$.
   \

  #v(.5em)

  Find each derivative, if it exists.  \
  If it does not exist, explain why.

  + $u' (1)$
  + $v' (1)$

  #align(center)[#drawing(width: 59mm, {
    // Redrawn from website/public/slide-images/G10.png.
    import "@preview/cetz:0.5.3": canvas, draw
    let pink = rgb(229, 0, 125)
    let cyan = rgb(0, 160, 220)
    let axis = (stroke: .9pt, mark: (end: "stealth", fill: black, scale: 1.2))
    set text(font: "New Computer Modern", size: 16pt)
    show math.equation: set text(font: "New Computer Modern Math")
    canvas(length: 1cm, {
      import draw: *
      grid((-1, -1), (7, 6), step: 1, stroke: .6pt + gray)
      line((-1, 0), (7, 0), ..axis)
      line((0, -1), (0, 6), ..axis)
      line((-1, 1), (0, 0), (2, 4), (7, 2.75), stroke: 1.3pt + pink)
      line((0, 6), (2, 0), (7, 10 / 3), stroke: 1.3pt + cyan)
      content((2.6, 4.45), $f$)
      content((3.7, 1.55), $g$)
      content((-.35, 5.75), $y$)
      content((6.75, -.45), $x$)
      content((-.35, -.4), $0$)
      content((1, -.45), $1$)
      content((-.38, 1), $1$)
    })
  })]
]
