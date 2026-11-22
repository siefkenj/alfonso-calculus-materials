#question(title: [“Secant segments are above the graph"], shrink: true)[
  #set text(size: 13pt)

  Let $f$ be a function defined on an
  interval $I$. \
  In Video 6.13 you learned that an
  alternative to our definition of “$f$ is
  concave up on $I$" is “the secant segments
  stay above the graph".

  #align(center)[
    #{
      import "@preview/cetz:0.5.3": canvas, draw
      let f(x) = (x - 2.5) * (x - 2.5) / 2 + .5
      let (a, b, c) = (.8, 2, 3.6)
      let secant(x) = f(a) + (f(c) - f(a)) / (c - a) * (x - a)
      let (P, Q) = ((b, f(b)), (b, secant(b)))
      canvas(length: 1.2cm, {
        import draw: *
        set-style(content: (padding: 3pt))
        line((-.5, 0), (5, 0), stroke: 1pt, mark: (end: "stealth", fill: black))
        line((0, -.5), (0, 3), stroke: 1pt, mark: (end: "stealth", fill: black))
        line(
          ..range(81).map(i => {
            let x = .5 + i * 4 / 80
            (x, f(x))
          }),
          stroke: 1.6pt + red,
        )
        content((5.5, 1.5), text(fill: red, size: 16pt, $y = f(x)$))
        line((a, f(a)), (c, f(c)), stroke: 1pt + blue)
        for (x, name) in ((a, $a$), (c, $c$)) {
          circle((x, f(x)), radius: .08, fill: blue, stroke: none)
          line((x, -.1), (x, .1), stroke: 1pt + blue)
          content((x, -.1), text(fill: blue, size: 16pt, name), anchor: "north")
        }
        line((b, -.1), (b, .1), stroke: 1pt)
        content((b, -.1), text(size: 15pt, $b$), anchor: "north")
        for (point, name, label) in ((P, $P$, $y_P$), (Q, $Q$, $y_Q$)) {
          let y = point.at(1)
          circle(point, radius: .08, fill: black)
          content(point, text(size: 15pt, name), anchor: "south-west")
          line((-.1, y), (.1, y), stroke: 1pt)
          content((-.1, y), text(size: 16pt, label), anchor: "east")
        }
      })
    }
  ]

  Rewrite this as a precise mathematical
  statement of the form
  $
    “ forall a, b, c in I, quad a < b < c thick ==> thick #boxed[$display(#[an
    inequality involving $f$, $a$, $b$,
    $c$])$] ”
  $
]
