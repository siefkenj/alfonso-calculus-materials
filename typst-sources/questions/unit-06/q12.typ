#question(title: [Limits from graphs], shrink: true)[
  Compute:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> 0) (H(x))/(H(2 + 3 x) - 1))$
    ],
    [
      2. $display(lim_(x -> 2) (F^(-1) (x))/(x - 2))$
    ],
  )

  #drawing(width: 56mm, {
    let H1(x) = x - calc.pow(x + 1, 2) / 2
    let H2(x) = x
    let H3(x) = 5 - 2 * x
    function-graph(
      graph-fn(H1, to: -1),
      graph-fn(H2, from: -1, to: 1),
      graph-fn(H3, from: 1),
      graph-dot(1, H2(1), radius: 4, open: true),
      graph-dot(1, H3(1), radius: 4, open: true),
      graph-text(1.5, -1.5)[$y = H(x)$],
    )
  })
  #h(1fr)
  #drawing(width: 56mm, {
    let F(x) = 2 + 3 * calc.tanh(x)
    function-graph(
      y: (-1.3, 5.3),
      graph-fn(F),
      graph-text(-2.5, 3.5, size: 40)[$y = F(x)$],
    )
  })
]
