#question(title: [What is wrong with this proof?], shrink: true)[
  #slide-block(title: [Theorem])[
    Let $a < b$. Let $f$ be a differentiable
    function on $(a, b)$.
    - IF $forall x in(a, b), f' (x) > 0$,
    - THEN $f$ is increasing on $(a, b)$.
  ]

  #proof[
    - From the MVT,
      $display(f' (c) = (f(b) - f(a))/(b - a))$
    - We know $display(b - a > 0)$ and
      $display(f' (c) > 0)$
    - Therefore $display(f(b) - f(a) > 0)$.
      #h(1em) Thus $display(f(b) > f(a))$.
    - $f$ is increasing.
  ]
]
