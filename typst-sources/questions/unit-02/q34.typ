#question(title: [Critique this “proof" -- \#1])[
  #set text(size: 13pt)

  - WTS
    $display(lim_(x -> a) [f(x) g(x)] = 0)$:

    #h(1fr) $display(forall epsilon > 0 comma exists delta > 0)$ #h(.25em) s.t.
    #h(.25em)
    $display(0 < abs(x - a) < delta ==> #text(fill: blue)[$display(abs(f(x) g(x)) < epsilon)$])$.

  #v(1fr)
  - We know $display(lim_(x -> a) f(x) = 0)$

    #h(1fr) $display(forall epsilon_1 > 0 comma exists delta_1 > 0)$ #h(.25em)
    s.t. #h(.25em)
    $display(0 < abs(x - a) < delta_1 ==> #text(fill: blue)[$display(abs(f(x)) < epsilon_1)$])$.

  #v(1fr)
  - We know #h(1fr) $display(exists M > 0)$
    #h(.25em) s.t. #h(.25em)
    $display(forall x != 0 comma thick thick #text(fill: blue)[$display(abs(g(x)) <= M)$])$.

  #v(1fr)
  - $display(abs(f(x) g(x)) = abs(f(x) || g(x)) < epsilon_1 M)$

  #v(1fr)
  - $display(epsilon = epsilon_1 M ==> epsilon_1 = epsilon/M)$

  #v(1fr)
  - Take $display(delta = delta_1)$

  #v(1fr)
]
