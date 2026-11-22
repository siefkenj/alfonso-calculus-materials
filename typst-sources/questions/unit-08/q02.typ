#question(title: [Compute these antiderivatives by guess 'n check])[
  #set text(size: 13pt)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral x^5 d x)$
      + $display(integral(3 x^8 - 18 x^5 + 1) d x)$
      + $display(integral root(3, x) thick d x)$
      + $display(integral 1/(x^9) thick d x)$
      + $display(integral sqrt(x) (x^2 + 5) d x)$
      + $display(integral 1/(e^(2 x)) thick d x)$
    ],
    [
      7. $display(integral sin(3 x) thick d x)$
      + $display(integral cos(3 x + 2) thick d x)$
      + $display(integral sec^2 x thick d x)$
      + $display(integral sec x tan x thick d x)$
      + $display(integral 1/x thick d x)$
      + $display(integral 1/(x + 3) thick d x)$
    ],
  )
]
