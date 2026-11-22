#question(title: [An alternative definition], shrink: true)[
  #set text(size: 13pt)

  Let $f$ be a bounded function on the
  interval $[a, b]$. Let $M in RR$.

  Some of these four statements imply others.
  What implies what?
  #v(0.2cm)

  + $forall$ partition $P$ of $[a, b]$,
    #h(.25em)
    $display(L_P (f) thin <= thin M)$,
  + $forall epsilon > 0$, $exists$ partition
    $P$ of $[a, b]$ #h(.25em) s.t. #h(.25em)
    $display(M - epsilon thin < thin L_P (f))$
  + $display(M thin <= thin underline(I_a^b) (f))$
  + $display(underline(I_a^b) (f) thin <= thin M)$

  #v(.5em)

  Based on this exercise, we could have
  defined $underline(I_a^b) (f)$ as  \
  “the only number $M in RR$ satisfying these
  two properties: ..."

  Use the same idea to write an alternative
  definition of $overline(I_a^b) (f)$.

  #v(.5em)
]
