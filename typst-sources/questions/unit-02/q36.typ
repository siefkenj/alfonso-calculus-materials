#question(title: [Critique this “proof" -- \#3])[
  // 12pt, not the LaTeX's 13pt: the lines are as long as there.
  #set text(size: 12pt)
  // Its dots without the space around operators, as in the LaTeX: on one line.
  #let cdot = math.class("normal", sym.dot.op)

  - Since $g$ is bounded,
    $display(exists M > 0)$ #h(.25em) s.t.
    #h(.5em)
    $display(forall x != 0 comma thick abs(g(x)) <= M)$

  #v(1fr)
  - Since $display(lim_(x -> a) f(x) = 0)$,
    there exists $display(delta_1 > 0)$ s.t.

    if $display(0 < abs(x - a) < delta_1)$,
    #h(1em) then #h(.25em)
    #box($display(abs(f(x) - 0) = abs(f(x)) < epsilon_1 = epsilon/M)$).

  #v(1fr)
  - $display(abs(f(x) g(x)) = abs(f(x)) cdot abs(g(x)) <= abs(f(x)) cdot M
      < epsilon_1 cdot M = epsilon/M cdot M = epsilon)$

  - In summary, by setting
    $display(delta = min {delta_1})$, we find
    that

    if $display(0 < abs(x - a) < delta)$,
    #h(1em) then #h(.25em)
    $display(abs(f(x) dot.op g(x)) < epsilon)$.

  #v(1fr)
]
