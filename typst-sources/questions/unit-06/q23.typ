#question(title: [True or False -- Concavity and inflection
points], shrink: true)[
  #set text(size: 13pt)

  Let $f$ be a differentiable function with
  domain $RR$.  \
  Let $c in RR$. Let $I$ be an interval.
  Which implications are true?

  + IF #text(fill: red)[$f$ is concave up on
    $I$], #h(1em) THEN
    #text(fill: blue)[$forall x in I$,
    $f^(' ') (x) > 0$].
  + IF #text(fill: blue)[$forall x in I$,
    $f^(' ') (x) > 0$], #h(1em) THEN
    #text(fill: red)[$f$ is concave up on
    $I$].
  + IF #text(fill: red)[$f$ is concave up on
    $I$] #h(1em) THEN #text(fill: verde)[$f'$
    is increasing on $I$].
  + IF #text(fill: verde)[$f'$ is increasing
    on $I$], #h(1em) THEN
    #text(fill: red)[$f$ is concave up on
    $I$].
  + IF #text(fill: rosa)[$f$ has an I.P. at
    $c$], #h(1em) THEN
    #text(fill: naranja)[$f^(' ') (c) = 0$].
  + IF
    #text(fill: naranja)[$f^(' ') (c) = 0$],
    #h(1em) THEN #text(fill: rosa)[$f$ has an
    I.P. at $c$].
  + IF #text(fill: rosa)[$f$ has an I.P. at
    $c$], #h(1em) THEN
    #text(fill: violet)[$f'$ has a local
    extremum at $c$]
  + IF #text(fill: violet)[$f'$ has a local
    extremum at $c$], #h(1em) THEN
    #text(fill: rosa)[$f$ has an I.P. at
    $c$].

  #align(center)[I.P.  = “inflection point"]
]
