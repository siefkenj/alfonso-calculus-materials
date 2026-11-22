#question(title: [Balloon])[
  I am inflating a spherical balloon. Below
  is the graph of the radius $r$ (in $c m$)
  as a function of time $t$ (in $s$). At what
  rate is the volume of the balloon
  increasing at time $4 s$?

  #align(center)[
    #only("1")[#drawing(width: 68mm, {
      let r1(t) = 1.9 * calc.root(t, 3)
      let r2(t) = 1.9 * calc.root(5, 3)
      let r3(t) = 1.9 * calc.root(5, 3) + calc.sqrt(t - 6)
      function-graph(
        x: (-1.3, 7.3),
        y: (-1.3, 7.3),
        graph-fn(r1, from: 0, to: 5, samples: 400),
        graph-fn(r2, from: 5, to: 6),
        graph-fn(r3, from: 6, samples: 400),
        graph-text(0.8, 6.5)[$r$ (cm)],
        graph-text(6.5, 0.5)[$t$ (s)],
      )
    })]
    #only("2")[#drawing(width: 68mm, {
      let r1(t) = 1.9 * calc.root(t, 3)
      let r2(t) = 1.9 * calc.root(5, 3)
      let r3(t) = 1.9 * calc.root(5, 3) + calc.sqrt(t - 6)
      let dr1(t) = 1.9 / 3 * calc.pow(t, -2 / 3)
      let tangent(t) = r1(4) + dr1(4) * (t - 4)
      function-graph(
        x: (-1.3, 7.3),
        y: (-1.3, 7.3),
        graph-fn(r1, from: 0, to: 5, samples: 400),
        graph-fn(r2, from: 5, to: 6),
        graph-fn(r3, from: 6, samples: 400),
        graph-text(0.8, 6.5)[$r$ (cm)],
        graph-text(6.5, 0.5)[$t$ (s)],
        graph-fn(tangent, color: graph-red),
      )
    })]
  ]
]
