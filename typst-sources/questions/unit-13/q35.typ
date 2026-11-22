#question(title: [Positive and negative terms - 2], shrink: true)[
  #set text(size: 11pt)

  - Let $display(sum a_n)$ be a series.
  - $display(sum "(P.T.)")$ #h(.25em) =
    #h(.25em) sum of only the positive terms
    of the same series.
  - $display(sum "(N.T.)")$ #h(.25em) =
    #h(.25em) sum of only the negative terms
    of the same series.

  #align(center, table(
    columns: (auto, 1fr, 1fr),
    align: (right + horizon, center + horizon, center + horizon),
    // Ruled as the LaTeX `c|c|c|`: no rule at the left edge or the top.
    stroke: (x, y) => (left: if x > 0 { .5pt }, top: if y > 0 { .5pt }, right: .5pt, bottom: .5pt),
    [], [$display(sum "(P.T.)")$ may be...], [$display(sum "(N.T.)")$ may
    be...],
    [If $display(sum a_n)$ is CONV], [], [],
    [If $display(sum abs(a_n))$ is CONV], [], [],
    [If $display(sum a_n)$ is ABS CONV], [], [],
    [If $display(sum a_n)$ is COND CONV], [], [],
    [If $display(sum a_n = oo)$], [], [],
    [If $display(sum a_n)$ is DIV oscillating], [], [],
  ))
]
