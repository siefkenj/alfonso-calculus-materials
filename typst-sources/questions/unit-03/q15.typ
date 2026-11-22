#question(title: [Differentiable functions])[
  Let $a in RR$.  \
  Let $f$ be a function with domain $RR$.  \
  Assume $f$ is differentiable everywhere.  \
  What can we conclude?

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $f(a)$ is defined.
      + $display(lim_(x -> a) f(x))$ exists.
      + $f$ is continuous at $a$.
    ],
    [
      4. $f' (a)$ exists.
      + $display(lim_(x -> a) f' (x))$
        exists.
      + $display(f')$ is continuous at $a$.
    ],
  )
]
