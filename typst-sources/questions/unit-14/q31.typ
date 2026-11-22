#question(title: [Tangent])[
  #set text(size: 13pt)

  There is no nice, compact formula for the
  Maclaurin series of $tan$, but we can
  obtain the first few terms. Set
  $
    tan x = c_1 x + c_3 x^3 + c_5 x^5 + ...
  $
  By definition of $tan$, we have:
  $
    #text(fill: red)[$display(sin x)$] = (#text(fill: blue)[$display(cos x)$])(#text(fill: verde)[$display(tan x)$])
  $
  Thus #[
    #set text(size: 11pt)

    $
      [#text(fill: red)[$display(x - (x^3)/(3!) + (x^5)/(5!) + ...)$]] thick = thick [#text(fill: blue)[$display(1 - (x^2)/(2!) + (x^4)/(4!) + ...)$]] dot.op [#text(fill: verde)[$display(c_1 x + c_3 x^3 + c_5 x^5 + ...)$] #hide[$display(1/1)$]]
    $
  ]

  Multiply the two series on the right.
  Obtain equations for the coefficients $c_n$
  and solve for the first few ones.
]
