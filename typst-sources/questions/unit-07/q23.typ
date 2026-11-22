#question(title: [The “$epsilon$--characterization" of integrability - Part 1])[
  #set text(size: 11pt)

  #slide-block(title: [#set text(size: 11pt)
  True or False?])[
    Let $f$ be a bounded function on
    $[a, b]$.
    - IF #h(1fr) “$forall epsilon > 0$,
      $exists$ a partition $P$ of $[a, b]$
      s.t.
      $display(U_P (f) - L_P (f) < epsilon)$",
    - THEN #h(.25em) $f$ is integrable on
      $[a, b]$
  ]

  #emph[Hints:]
  + Recall the definition of “$f$ is
    integrable on $[a, b]$".
  + Let $P$ be a partition.  \
     Order the numbers $display(U_P (f))$,
     $display(L_P (f))$,
     $display(overline(I_a^b) (f))$,
     $display(underline(I_a^b) (f))$.  \
     (Draw a picture of these numbers in the
     real line.)
]
