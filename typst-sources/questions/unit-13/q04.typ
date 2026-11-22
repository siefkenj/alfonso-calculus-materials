#question(title: [What can you conclude?])[
  #set text(size: 13pt)

  Assume
  $display(forall n in NN comma thick a_n > 0)$.
  Consider the series
  $display(sum_(n = 0)^oo a_n)$.

  Let $display({S_n}_(n = 0)^oo)$ be its
  sequence of partial sums.
  #v(0.5cm)

  In each of the following cases, what can
  you conclude about the #emph[series]? Is it
  convergent, divergent, or we do not know?
  #v(0.5cm)

  + $display(forall n in NN comma thick #[#hide[s.t.]] quad exists M in RR thick " s.t. " thick quad S_n <= M)$.
  + $display(exists M in RR thick " s.t. " quad forall n in NN comma thick #[#hide[s.t.]] quad S_n <= M)$.
  + $display(exists M > 0 thick " s.t. " thick quad forall n in NN comma thick #[#hide[s.t.]] quad a_n <= M)$.
  + $display(exists M > 0 thick " s.t. " thick quad forall n in NN comma thick #[#hide[s.t.]] quad a_n >= M)$.
]
