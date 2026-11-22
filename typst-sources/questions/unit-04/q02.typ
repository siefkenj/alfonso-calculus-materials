#question(title: [#set text(size: 12pt)
Finding a Restricted Domain on which a
Function is Invertible], centered: true)[
  #align(center)[
    #{
      import "@preview/cetz:0.5.3": canvas, draw
      let f(x) = x * x * x - x
      let xs = range(61).map(i => -1.5 + i * 3 / 60)
      canvas(length: 1cm, {
        import draw: *
        set-style(content: (padding: 2pt))
        line((-2.2, 0), (2.5, 0), mark: (end: "stealth", fill: black))
        content((2.5, 0), $x$, anchor: "west")
        line((0, -1.5), (0, 2.2), mark: (end: "stealth", fill: black))
        content((0, 2.2), $y$, anchor: "south")
        line(..xs.map(x => (x, f(x))), stroke: 1.6pt + blue)
        content((1.5, f(1.5)), $f$, anchor: "west")
        for x in (-2, -1, 1, 2) {
          line((x, -.2), (x, .2))
          content((x, -.2), text(size: 10pt, $#x$), anchor: "north")
        }
        for y in (-1, 1, 2) { content((0, y), text(size: 10pt, $#y$), anchor:
        "west") }
      })
    }
  ]

  + Find the largest interval containing 0 on
    which $f$ is invertible.
  + Find the largest interval containing 1 on
    which $f$ is invertible.
]
