#question(title: [A new squeeze], shrink: true)[
  #set text(size: 13pt)
  This is the Squeeze Theorem, as you know
  it:

  #slide-block(title: [The (classical) Squeeze Theorem])[
    Let $a, L in RR$.  \
    Let $f$, $g$, and $h$ be functions
    defined near $a$, except possibly at $a$.

    #v(0.2cm)

    #table(
      columns: 2,
      align: (center, left),
      stroke: none,
      [IF], [$bullet$ For $x$ close to $a$ but not $a$, #h(.25em)
      $display(h(x) <= g(x) <= f(x))$],
      [], [$bullet$ $display(lim_(x -> a) f(x) = L)$ #h(1em) and
      #h(1em)$display(lim_(x -> a) h(x) = L)$],
      [THEN], [$bullet$ $display(lim_(x -> a) g(x) = L)$],
    )
  ]

  Come up with a new version of the theorem
  about limits being infinity. (The
  conclusion should be
  $display(lim_(x -> a) g(x) = oo)$.)

  #emph[Hint:] Draw a picture for the
  classical Squeeze Theorem. Then draw a
  picture for the new theorem.
]
