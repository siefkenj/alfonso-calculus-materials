#question(title: [Plus or minus infinity?], centered: true)[
  Compute:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> - 3^+) thick (x^2 - 9)/(3 - 2 x - x^2))$
    ],
    [
      2. $display(lim_(x -> 1^+) thick (x^2 - 9)/(3 - 2 x - x^2))$
    ],
  )
]
