#question(title: [The Mean Value Theorem for integrals is back])[
  #set text(size: 13pt)

  Prove the following theorem.

  #slide-block(title: [#set text(size: 13pt)
  Theorem])[
    Let $a < b$. Let $f$ be a continuous
    function on $[a, b]$.  \
    There exists $c in [a, b]$ such that

    $
      f(c) thick = thick 1/(b - a) integral_a^b f(t) d t
    $
  ]

  #emph[Hint:] Use MVT for the function
  $display(F(x) = integral_a^x f(t) d t)$.
]
