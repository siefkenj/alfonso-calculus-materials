#question(title: [$s i n$ is analytic], centered: true, shrink: true)[
  #set text(size: 13pt)

  Let $display(f(x) = sin x)$. You know its
  Maclaurin series is
  $
    S(x) thick = thick sum_(n = 0)^oo (- 1)^n (x^(2 n + 1))/((2 n + 1)!) thick = thick x - (x^3)/(3!) + (x^5)/(5!) - (x^7)/(7!) + ...
  $
  As you know, to prove that
  $display(sin x = S(x))$ we need to show
  that
  $
    forall x in RR, quad lim_(n -> oo) R_n (x) = 0
  $
  Use Lagrange's Remainder Theorem to prove
  it!

  #box(width: 1fr, line(length: 100%, stroke: .5pt))

  #emph[Reminder:] Lagrange's Remainder
  Theorem says that given $f$, $a$, $x$, and
  $n$ with certain conditions,
  $
    exists xi #[between $a$ and $x$
    s.t.] quad R_n (x) thin = thin (f^((n + 1)) (xi))/((n + 1)!) thin(x - a)^(n + 1)
  $
]
