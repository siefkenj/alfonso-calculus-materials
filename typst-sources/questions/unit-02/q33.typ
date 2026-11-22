#question(title: [A new theorem about products])[
  #set text(size: 13pt)

  #slide-block(title: [Theorem])[
    Let $a in RR$. Let $f$ and $g$ be
    functions with domain $RR$, except
    possibly $a$. Assume
    - $display(lim_(x -> a) f(x) = 0)$, and
    - $g$ is bounded. This means that
      $
        exists M > 0 " s.t. " forall x != a, abs(g(x)) <= M .
      $

    THEN
    $display(lim_(x -> a) [f(x) g(x)] = 0)$
  ]

  #v(1fr)

  + Write down the formal definition of what
    you want to prove.
  + Write down what the structure of the
    formal proof.
  + Rough work.
  + Write down a complete formal proof.

  #v(1fr)
]
