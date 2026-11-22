#question(title: [A new squeeze], shrink: true)[
  #set text(size: 13pt)

  #slide-block(title: [The (new) Squeeze Theorem])[
    Let $a in RR$.  \
    Let $g$ and $h$ be functions defined near
    $a$, except possibly at $a$.

    #v(0.2cm)

    #table(
      columns: 2,
      align: (center, left),
      stroke: none,
      [IF], [$bullet$ For $x$ close to $a$ but not $a$, #h(.25em)
      $display(h(x) <= g(x))$],
      [], [$bullet$ $display(lim_(x -> a) h(x) = oo)$],
      [THEN], [$bullet$ $display(lim_(x -> a) g(x) = oo)$],
    )
  ]

  + Replace the first hypothesis with a more
    precise mathematical statement.
  + Write down the definition of what you
    want to prove.
  + Write down the structure of the formal
    proof.
  + Rough work
  + Write down a complete, formal proof.
]
