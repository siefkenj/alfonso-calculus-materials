#question(title: [True or False - Comparisons II])[
  #set text(size: 11pt)

  Let $a in RR$.  \
  Let $f$ and $g$ be continuous functions on
  $[a, oo)$.  \
  Assume that
  $display(#boxed[$display(forall x >= a comma quad #text(fill: blue)[$display(f(x))$] <= #text(fill: red)[$display(g(x))$])$])$.
   \
  What can we conclude?

  + IF
    $display(#text(fill: blue)[$display(integral_a^oo f(x) d x)$])$
    is convergent, #h(.17em) THEN
    $display(#text(fill: red)[$display(integral_a^oo g(x) d x)$])$
    is convergent.
  + IF
    $display(#text(fill: blue)[$display(integral_a^oo f(x) d x)$] = oo)$,
    #h(.17em) THEN
    $display(#text(fill: red)[$display(integral_a^oo g(x) d x)$] = oo)$.
  + IF
    $display(#text(fill: red)[$display(integral_a^oo g(x) d x)$])$
    is convergent, #h(.17em) THEN
    $display(#text(fill: blue)[$display(integral_a^oo f(x) d x)$])$
    is convergent.
  + IF
    $display(#text(fill: red)[$display(integral_a^oo g(x) d x)$] = oo)$,
    #h(.17em) THEN
    $display(#text(fill: blue)[$display(integral_a^oo f(x) d x)$] = oo)$.
]
