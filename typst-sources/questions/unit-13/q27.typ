#question(title: [True or False - Odd and even partial sums])[
  #set text(size: 12pt)

  Let $display(sum_(n = 0)^oo a_n)$ be a
  series. Let $display({S_n}_(n = 0)^oo)$ be
  its partial-sum sequence.

  #set enum(spacing: .55em + 0.5cm)
  + IF $display(lim_(n -> oo) S_(2 n))$
    exists, #h(1em) THEN #h(.25em)
    #text(fill: blue)[$display(sum_(n = 0)^oo a_n)$
    is convergent].
  + IF $display(lim_(n -> oo) S_(2 n))$
    exists #h(.25em) and #h(.25em)
    $display(lim_(n -> oo) S_(2 n + 1))$
    exists,

     THEN #h(.25em)
     #text(fill: blue)[$display(sum_(n = 0)^oo a_n)$
     is
     convergent].
  + IF $display(lim_(n -> oo) S_(2 n))$
    exists #h(.25em) and #h(.25em)
    $display(lim_(n -> oo) a_n = 0)$,

     THEN #h(.25em)
     #text(fill: blue)[$display(sum_(n = 0)^oo a_n)$
     is
     convergent].
]
