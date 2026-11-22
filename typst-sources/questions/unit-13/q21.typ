#question(title: [For which values of $a in RR$ are these series convergent?])[
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_n^oo 1/(a^n))$
      + $display(sum_n^oo 1/(n^a))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      3. $display(sum_n^oo a^n)$
      + $display(sum_n^oo n^a)$
    ],
  )
]
