#question(title: [Critique this “proof"], shrink: true)[
  #set text(size: 12pt)

  - $display(#hide[$display(#text(fill: red)[$display(d/(d x))$])$] [2 arctan sqrt(x) - arcsin (x - 1)/(x + 1)] = #hide[$display(#text(fill: red)[$display(d/(d x))$])$] [pi/2])$
  - $display(#text(fill: red)[$display(d/(d x))$] [2 arctan sqrt(x) - arcsin (x - 1)/(x + 1)] = #text(fill: red)[$display(d/(d x))$] [pi/2])$
  - $display(2/(1 + (sqrt(x))^2) dot.op 1/(2 sqrt(x)) thick - thick 1/sqrt(1 - ((x - 1)/(x + 1))^2) dot.op ((x + 1) -(x - 1))/((x + 1)^2) thick = thick 0)$
  - $display(1/((1 + x) sqrt(x)) thick - thick 1/sqrt((4 x)/((x + 1)^2)) dot.op 2/((x + 1)^2) thick = thick 0)$
  - $display(0 = 0)$
  - So
    $display(2 arctan sqrt(x) - arcsin (x - 1)/(x + 1))$
    is constant.
  - Evaluate at $x = 0$ to find the value of
    the constant.
  - $display(2 arctan 0 thick - thick arcsin(- 1) thick = thick 0 -(-pi \/ 2) thick = thick pi \/ 2)$
  - Therefore, #h(.25em)
    $display(2 arctan sqrt(x) - arcsin (x - 1)/(x + 1) thick = thick pi/2)$
]
