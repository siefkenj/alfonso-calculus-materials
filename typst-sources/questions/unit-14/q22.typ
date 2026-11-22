#question(title: [Generalize your proof (continued)], shrink: true)[
  #set text(size: 12pt)

  Which one or ones of the following
  conditions can be written instead of
  “#boxed[$display(? ? ?)$]" to make the
  theorem true?
  #v(0.2cm)

  + $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em) $display(f^((n)))$ is bounded
    on $I$
  + $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    #text(fill: red)[$display(forall x in I)$],
    #h(.25em) $display(f^((n)))$ is bounded
    on $J_(x, a)$
  + $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    #text(fill: red)[$display(forall x in I)$],
    #h(.25em)
    #text(fill: violet)[$display(exists A comma B in RR)$],
    #h(.25em)
    #text(fill: verde)[$display(forall xi in J_(x comma a))$],
    #h(.25em)
    $display(A <= f^((n)) (#text(fill: verde)[$display(xi)$]) <= B)$
  + #text(fill: red)[$display(forall x in I)$],
    #h(.25em)
    #text(fill: violet)[$display(exists A comma B in RR)$],
    #h(.25em)
    $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    #text(fill: verde)[$display(forall xi in J_(x comma a))$],
    #h(.25em)
    $display(A <= f^((n)) (#text(fill: verde)[$display(xi)$]) <= B)$
  + #text(fill: red)[$display(forall x in I)$],
    #h(.25em)
    #text(fill: violet)[$display(exists M >= 0)$],
    #h(.25em)
    $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    #text(fill: verde)[$display(forall xi in J_(x comma a))$],
    #h(.25em)
    $display(lr(abs(f^((n)) (#text(fill: verde)[$display(xi)$]))) <= M)$
  + $display(#text(fill: violet)[$display(exists A comma B in RR)$])$,
    #h(.25em)
    #text(fill: red)[$display(forall x in I)$],
    #h(.25em)
    $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    #text(fill: verde)[$display(forall xi in J_(x comma a))$],
    #h(.25em)
    $display(A <= f^((n)) (#text(fill: verde)[$display(xi)$]) <= B)$
  + $display(#text(fill: violet)[$display(exists A comma B in RR)$])$,
    #h(.25em)
    #text(fill: red)[$display(forall x in I)$],
    #h(.25em)
    $display(#text(fill: blue)[$display(forall n in NN)$])$,
    #h(.25em)
    $display(A <= f^((n)) (#text(fill: red)[$display(x)$]) <= B)$

  #v(0.5cm)

  #emph[Notation:] $display(J_(x comma a))$
  is the interval between $x$ and $a$
]
