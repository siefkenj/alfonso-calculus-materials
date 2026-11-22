#question(title: [Critique this “proof" -- \#2])[
  #set text(size: 13pt)

  - WTS
    $display(lim_(x -> a) [f(x) g(x)] = 0)$.
    By definition, WTS:

    #h(1fr) $display(forall epsilon > 0 comma exists delta > 0)$ s.t.
    $display(0 < abs(x - a) < delta ==> abs(f(x) g(x)) < epsilon)$

  #v(1fr)
  - Let $epsilon > 0$.

  #v(1fr)
  - Use the value $display(epsilon/M)$ as
    “epsilon" in the definition of
    $display(lim_(x -> a) f(x) = 0)$

    #h(1fr) $display(exists delta_1 in RR)$ s.t.
    $display(0 < abs(x - a) < delta_1 ==> abs(f(x)) < epsilon/M)$.

  #v(1fr)
  - Take $display(delta = delta_1)$.

  #v(1fr)
  - Let $display(x in RR)$. Assume
    $display(0 < abs(x - a) < delta)$

  #v(1fr)
  - Since $display(exists M > 0)$ s.t.
    $display(forall x != 0 comma abs(g(x)) <= M)$
     \
    #h(1fr) $display(abs(f(x) g(x)) < epsilon/M dot.op M = epsilon)$.

  #v(1fr)
]
