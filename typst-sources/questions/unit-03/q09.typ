#question(title: [Bella], centered: true, shrink: true)[
  The graph below describes Bella's distance
  from home one morning as she drives between
  her home and school.

  Describe a possible scenario for her
  travels that morning.  \
  Then sketch the corresponding graph of her
  velocity.

  #align(center)[#drawing(width: 83mm, {
    // Redrawn from website/public/slide-images/G9.png.
    import "@preview/cetz:0.5.3": canvas, draw
    let curve = rgb(0, 160, 220)
    // A polyline with its corners rounded off over `r`.
    let rounded(points, r, ..style) = {
      import draw: *
      let towards(a, b, d) = {
        let (dx, dy) = (b.at(0) - a.at(0), b.at(1) - a.at(1))
        let l = calc.sqrt(dx * dx + dy * dy)
        (a.at(0) + dx / l * d, a.at(1) + dy / l * d)
      }
      merge-path(..style, {
        let start = points.first()
        for i in range(1, points.len() - 1) {
          let corner = points.at(i)
          let a = towards(corner, points.at(i - 1), r)
          let b = towards(corner, points.at(i + 1), r)
          line(start, a)
          bezier(a, b, corner)
          start = b
        }
        line(start, points.last())
      })
    }
    set text(font: "New Computer Modern", size: 13pt)
    show math.equation: set text(font: "New Computer Modern Math")
    canvas(length: 1cm, {
      import draw: *
      line((-.55, 0), (7.3, 0), stroke: .7pt)
      line((0, -.55), (0, 5.1), stroke: .7pt)
      rounded(
        ((0, 0), (2.0, 3.59), (3.1, 3.59), (3.82, 0), (4.6, 0), (5.3, 2.09), (6.0, 2.09), (6.75, 3.59), (7.3, 3.59)),
        .18,
        stroke: 1.4pt + curve,
      )
      for (x, name) in ((2.07, $a$), (3.1, $b$), (3.82, $c$), (4.6, $d$), (5.33, $e$), (6.06, $f$), (6.78, $g$)) {
        line((x, -.1), (x, .1), stroke: .7pt)
        content((x, -.15), name, anchor: "north")
      }
      content((7.45, 0), [Time], anchor: "west")
      content((-.55, 2.55), std.rotate(-90deg, reflow: true)[Distance from home], anchor: "east")
    })
  })]
]
