#question(title: [Where is the error?])[
  - We know that
    #boxed[$display(#text(fill: blue)[$display((f^(-1))' = 1/(f'))$])$]
  - Let $display(f(x) = x^2)$, restricted to
    the domain $display(x in(0 comma oo))$
    $
      f' (x) = 2 x quad "and" quad #boxed[$display(#text(fill: red)[$display(f' (4) = 8)$])$]
    $
  - Then $display(f^(-1) (x) = sqrt(x))$
    $
      (f^(-1))' (x) = 1/(2 sqrt(x)) quad " and " quad #boxed[$display(#text(fill: red)[$display((f^(-1))' (4) = 1/4)$])$]
    $
  - So
    #boxed[$display(#text(fill: blue)[$display((f^(-1))' (4) != 1/(f' (4)))$])$]
]
