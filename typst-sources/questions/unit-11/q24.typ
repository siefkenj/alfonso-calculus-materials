#question(title: [True or False - Review])[
  #set text(size: 13pt)

  #set enum(spacing: .55em - 0.1cm)
  + If $display({a_n}_(n = 0)^oo)$ diverges
    and is increasing, then $exists n in NN$
    s.t. $a_n > 100$.
  + If $display(lim_(n -> oo) a_n = L)$,
    then $forall n in NN$,
    $display(a_n < L + 1)$.
  + If $display(lim_(n -> oo) a_n = L)$,
    then $exists n in NN$ s.t.
    $display(a_n < L + 1)$.
  + If $display(lim_(n -> oo) a_n = L)$,
    then $exists epsilon > 0$ s.t.
    $forall n in NN$,
    $display(a_n < L + epsilon)$.
  + If ${a_n}_(n = 0)^oo$ is convergent and
    $b_n = a_n$ for #emph[almost all]
    $n in NN$, then ${b_n}_(n = 0)^oo$ is
    convergent.
  + If $a_n << b_n$, then $exists n in NN$
    s.t. $a_n < b_n$.
  + If $a_n << b_n$, then
    $forall epsilon > 0$, $exists n in NN$
    s.t. $a_n < epsilon b_n$.
  + If $a_n << b_n$, then
    $forall epsilon > 0$, $exists n_0 in NN$
    s.t. $forall n in NN$,
    $n >= n_0 ==> a_n < epsilon b_n$,

  #v(1fr)
]
