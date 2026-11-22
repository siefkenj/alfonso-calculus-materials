#question(title: [A new theorem], shrink: true)[
  #set text(size: 13pt)

  We want to prove this theorem:
  #slide-block(title: [#set text(size: 13pt)
  Theorem 1])[
    Let $f$ be a differentiable function on
    an open interval $I$.  \
    IF
    $display(forall x in I comma f' (x) != 0)$
     \
    THEN $f$ is one-to-one on $I$.
  ]

  #v(1fr)

  + Transform #h(1em) $display([P ==> Q])$
    #h(1em) into \
    $display([("not " Q) ==>("not " P)])$.  \
     You get an equivalent Theorem (call it
     “Theorem 2").  \
     We are going to prove Theorem 2 instead.
  + Write the definition of “$f$ is not
    one-to-one on $I$". You will need it.
  + Recall the statement of Rolle's Theorem.
    You will need it.
  + Do some rough work if needed.
  + Write a complete proof for Theorem 2.
]
