#question(title: [Critique this proof - \#2])[
  #set text(size: 13pt)

  #[
    #v(1fr)
    - WTS $a_n -> oo$. This means:
      #v(0.2cm)
      #h(1em)
      $display(forall M in RR comma thick exists n_0 in NN comma thick forall n in NN comma quad n >= n_0 ==> x_n > M)$

    #v(1fr)
    - bounded above: #h(1em)
      $display(exists M in RR comma thick forall n in NN comma thick x_n <= M)$

    #v(1fr)
    - negation: #h(1em)
      $display(forall M in RR comma thick exists n in NN comma thick x_n > M)$

    #v(1fr)
    - $forall n in NN$, take $n = n_0$.

    #v(1fr)
  ]
]
