#question(title: [A variation on LCT], shrink: true)[
  #set text(size: 12pt)

  This is the theorem you have learned:
  #slide-block(title: [#set text(size: 13pt)
  Theorem (Limit-Comparison Test)])[
    Let $display(a in RR)$. Let $f$ and $g$
    be positive, continuous functions on
    $display([a comma oo))$.
    - IF the limit #h(.25em)
      $display(L = lim_(x -> oo) (f(x))/(g(x)))$
      #h(.25em) exists and #h(.25em)
      $display(L > 0)$
    - THEN $display(integral_a^oo f(x) d x)$
      #h(.25em) and #h(.25em)
      $display(integral_a^oo g(x) d x)$  \
      are both convergent or both divergent.
  ]

  #v(0.2cm)
  #strong[What if we change the hypotheses to
  $L = 0$?]
  + Write down the new theorem (different
    conclusion).
  + Prove it.

  #v(0.2cm)
  #emph[Hint:] If
  $display(lim_(x -> oo) (f(x))/(g(x)) = 0)$,
  what is larger $f(x)$ or $g(x)$?
]
