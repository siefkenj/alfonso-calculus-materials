#question(title: [True or False -- The Big Theorem])[
  #set text(size: 13pt)

  Let $display({a_n}_(n = 0)^oo)$ and
  $display({b_n}_(n = 0)^oo)$ be positive
  sequences.
  #v(0.15cm)

  #set enum(spacing: .55em + 0.05cm)
  + IF #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$],
    #h(1em) THEN #h(.25em)
    #text(fill: blue)[$display(forall m in NN)$,
    $display(a_m < b_m)$].
  + IF #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$],
    #h(1em) THEN #h(.25em)
    #text(fill: blue)[$display(exists m in NN)$
    s.t.
    $display(a_m < b_m)$].
  + IF #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$],
    #h(1em) THEN #h(.25em)
    #text(fill: blue)[$display(exists n_0 in NN)$
    s.t.]
    #v(0.15cm)

    #text(fill: blue)[$display(forall m in NN comma thick m >= n_0 ==> a_m < b_m)$].
  + IF #h(.25em)
    #text(fill: blue)[$display(forall m in NN comma thin a_m < b_m)$],
    #h(1em) THEN #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$].
  + IF #h(.25em)
    #text(fill: blue)[$display(exists m in NN)$
    s.t.
    $display(a_m < b_m)$], #h(1em) THEN
    #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$].
  + IF #h(.25em)
    #text(fill: blue)[$display(exists n_0 in NN)$
    s.t.
    $display(forall m in NN comma thick m >= n_0 ==> a_m < b_m)$],
    #v(0.15cm)

    THEN #h(.25em)
    #text(fill: red)[$display(a_n << b_n)$].

  #v(1fr)
]
