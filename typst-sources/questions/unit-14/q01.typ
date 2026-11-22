#question(title: [What can you conclude?], shrink: true)[
  #set text(size: 13pt)

  Think of the power series
  $display(sum_n^oo a_n x^n)$. Do not assume
  $a_n >= 0$.

  In each case, may the given series be
  absolutely convergent (AC)? conditionally
  convergent (CC)? divergent (D)? all of
  them?

  #align(center, table(
    columns: 5,
    align: center + horizon,
    inset: (x: .5em, y: .45em),
    // Ruled as the LaTeX `c|c|c|c|c|`: no rule at the left edge.
    stroke: (x, y) => (left: if x > 0 { .5pt }, right: .5pt, top: .5pt, bottom: .5pt),
    [IF], [$display(sum_n^oo a_n 3^n)$ is ...], [AC], [CC], [D],
    table.hline(y: 1, stroke: 1.5pt),
    table.cell(rowspan: 3)[THEN], [$display(sum_n^oo a_n 2^n)$ may be
    ...], [???], [???], [???],
    [$display(sum_n^oo a_n (- 3)^n)$ may be ...], [???], [???], [???],
    [$display(sum_n^oo a_n 4^n)$ may be ...], [???], [???], [???],
  ))
]
