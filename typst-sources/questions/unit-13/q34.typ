#question(title: [Positive and negative terms - 1], shrink: true)[
  #set text(size: 13pt)

  - Let $display(sum a_n)$ be a series.
  - Call $display(sum "(P.T.)")$ the sum of
    only the positive terms of the same
    series.
  - Call $display(sum "(N.T.)")$ the sum of
    only the negative terms of the same
    series.

  #align(center, table(
    columns: (1fr, 1fr, 1fr),
    align: center + horizon,
    inset: (x: .4em, y: .5em),
    // Ruled as the LaTeX `c|c|c`: rules between the cells only.
    stroke: (x, y) => (left: if x > 0 { .5pt }, top: if y > 0 { .5pt }),
    text(fill: blue)[IF $display(sum "(P.T.)")$ is...],
    text(fill: blue)[AND $display(sum "(N.T.)")$ is...],
    text(fill: blue)[THEN $display(sum a_n)$ may be...],
    [CONV], [CONV], [],
    [$oo$], [CONV], [],
    [CONV], [$-oo$], [],
    [$oo$], [$-oo$], [],
  ))
]
