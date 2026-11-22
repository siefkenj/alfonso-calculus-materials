#question(title: [Equivalent definitions of supremum], shrink: true)[
  #set text(size: 13pt)

  #strong[Assume $S$ is an upper bound of the
  set $A$.]  \
  Which of the following is equivalent to
  “$S$ is the supremum of $A$"?
  #v(0.2cm)

  + If $R$ is an upper bound of $A$,
    #h(.17em) then $S <= R$.
     #v(0.2cm)
  + $display(forall R >= S)$, #h(.17em) $R$
    is an upper bound of $A$.
  + $display(forall R <= S)$, #h(.17em) $R$
    is not an upper bound of $A$.
  + $display(forall R < S)$, #h(.17em) $R$ is
    not an upper bound of $A$.
  + $display(forall R < S)$, #h(.17em)
    $display(exists x in A)$ #h(.25em) such
    that #h(.25em) $display(R < x)$.
  + $display(forall R < S)$, #h(.17em)
    $display(exists x in A)$ #h(.25em) such
    that #h(.25em) $display(R <= x)$.
  + $display(forall R < S)$, #h(.17em)
    $display(exists x in A)$ #h(.25em) such
    that #h(.25em) $display(R < x <= S)$.
  + $display(forall R < S)$, #h(.17em)
    $display(exists x in A)$ #h(.25em) such
    that #h(.25em) $display(R < x < S)$.
  + $display(forall epsilon > 0)$, #h(.25em)
    #h(.17em) $display(exists x in A)$
    #h(.25em) such that #h(.25em)
    $display(S - epsilon < x)$.
  + $display(forall epsilon > 0)$, #h(.25em)
    #h(.17em) $display(exists x in A)$
    #h(.25em) such that #h(.25em)
    $display(S - epsilon < x <= S)$.
]
