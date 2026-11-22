#question(title: [The “$epsilon$--characterization" of integrability - Part 2])[
  #set text(size: 11pt)

  #slide-block(title: [#set text(size: 11pt)
  True or False?])[
    Let $f$ be a bounded function on
    $[a, b]$.
    - IF #h(1em) #h(1em) #h(.17em) $f$ is
      integrable on $[a, b]$
    - THEN #h(1fr) “$forall epsilon > 0$,
      $exists$ a partition $P$ of $[a, b]$
      s.t.
      $display(U_P (f) - L_P (f) < epsilon)$".
  ]

  #emph[Hints:] Assume $f$ is integrable on
  $[a, b]$. Let $I$ be the integral. Fix
  $epsilon > 0$.
  + Recall the definition of “$f$ is
    integrable on $[a, b]$".
  + There exist a partition $P_1$ s.t.
    $display(U_(P_1) (f) < I + epsilon/2)$.
    Why?
  + There exist a partition $P_2$ s.t.
    $display(L_(P_2) (f) > I - epsilon/2)$.
    Why?
  + What can you say about
    $display(U_(P_1) (f) - L_(P_2) (f))$?
  + Construct a partition $P$ s.t.
    $display(L_(P_2) (f) <= L_P (f) <= U_P (f) <= U_(P_1) (f))$.
]
