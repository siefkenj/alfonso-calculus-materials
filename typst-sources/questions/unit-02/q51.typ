#question(title: [Which solution is right?], centered: true)[
  #set text(size: 13pt)
  Compute
  $display(L = lim_(x -> - oo) [x - sqrt(x^2 + x)])$.

  - #strong[Solution 1] #[
      #set text(size: 11pt)

      $
        L = & lim_(x -> - oo) ([x - sqrt(x^2 + x)] thick [x + sqrt(x^2 + x)])/([x + sqrt(x^2 + x)]) = lim_(x -> - oo) (x^2 -(x^2 + x))/([x + sqrt(x^2 + x)]) \ = & lim_(x -> - oo) (-x)/(x [1 + sqrt(1 + 1/x)]) = lim_(x -> - oo) (-1)/([1 + sqrt(1 + 1/x)]) = (-1)/2
      $
    ]
  - #strong[Solution 2]
    $
      L = lim_(x -> - oo) [#text(fill: red)[$display(x)$] - #text(fill: blue)[$display(sqrt(x^2 + x))$]] = #text(fill: red)[$display((- oo))$] - #text(fill: blue)[$display(oo)$] = - oo
    $
]
