#question(title: [Write a proof for the quotient rule for derivatives])[
  #set text(size: 13pt)

  #slide-block(title: [Theorem])[
    - Let $a in RR$.
    - Let $f$ and $g$ be functions defined at
      and near $a$.  \
      Assume $g(x) != 0$ for $x$ close to
      $a$.
    - We define the function $h$ by
      $display(h(x) = (f(x))/(g(x)))$.

    IF $f$ and $g$ are differentiable at $a$,
     \
    THEN $h$ is differentiable at $a$, and
    $
      h' (a) = (f' (a) g(a) - f(a) g' (a))/(g(a)^2) .
    $
  ]

  #v(1fr)

  Write a proof directly from the definition
  of derivative.

  #emph[Hint:] Imitate the proof of the
  product rule in Video 3.6.
]
