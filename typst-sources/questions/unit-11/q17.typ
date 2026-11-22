#question(title: [Critique this proof - \#1])[
  #set text(size: 13pt)

  #[
    #v(1fr)
    - $display(forall M in RR comma thick exists n_0 in NN comma thick forall n in NN comma quad n >= n_0 ==> x_n > M)$

    #v(1fr)
    - $M$ is not an upper bound:
      $display(exists n_0 in NN)$ s.t.
      $display(x_(n_0) > M)$

    #v(1fr)
    - $display(n >= n_0 thick ==> thick x_n >= x_(n_0) > M)$

    #v(1fr)
  ]
]
