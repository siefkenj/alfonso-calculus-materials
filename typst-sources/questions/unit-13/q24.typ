#question(title: [Convergence tests: ninja level])[
  We know
  - $display(forall n in NN)$,
    $display(a_n > 0)$.
  - the series $display(sum_n^oo a_n)$ is
    convergent

  Determine whether the following series are
  convergent, divergent, or we do not have
  enough information to decide:
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(sum_n^oo sin a_n)$
      + $display(sum_n^oo cos a_n)$
    ],
    [
      3. $display(sum_n^oo sqrt(a_n))$
      + $display(sum_n^oo (a_n)^2)$
    ],
  )
]
