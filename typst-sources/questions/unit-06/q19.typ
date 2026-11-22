#question(title: [Indeterminate?], shrink: true)[
  // Four columns of five, numbered down each column; one grid, so that each
  // row lines up across the columns.
  #let forms = (
    $display(0/0)$, $display(0/oo)$,
    $display(0/1)$, $display(oo/0)$,
    $display(oo/oo)$, $display(1/oo)$,
    $0 dot.op oo$, $oo dot.op oo$,
    $sqrt(oo)$, $oo - oo$, $1^oo$, $1^(-oo)$,
    $0^0$, $0^oo$, $0^(-oo)$, $oo^0$,
    $oo^oo$, $oo^(-oo)$,
  )
  #let (rows, cols) = (5, 4)

  Which of the following are indeterminate
  forms for limits?  \
  If any of them isn't, then what is the
  value of such limit?

  #v(1fr)

  #grid(
    columns: (1fr,) * cols,
    row-gutter: .9em,
    align: left + horizon,
    ..range(rows * cols).map(cell => {
      let i = calc.rem(cell, cols) * rows + calc.quo(cell, cols)
      if i < forms.len() { enum(start: i + 1, indent: 0pt, box(forms.at(i))) }
    }),
  )

  #v(1fr)
]
