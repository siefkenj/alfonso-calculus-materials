#question(title: [Dirichlet integral], shrink: true)[
  #set text(size: 12pt)

  Let
  $display(f(x) = cases((sin x)/x & quad " if " x != 0, 1 & quad " if " x = 0))$
  #v(0.1cm)

  + Is #h(.25em)
    $display(integral_0^1 f(x) thin d x)$
    #h(.25em) an inproper integral?
  + Show that #h(.25em)
    $display(integral_1^oo (cos x)/(x^2) thin d x)$
    #h(.25em)is absolutely convergent.
     #v(0.1cm)

     #emph[Hint:] Use BCT.
  + The same argument is inconclusive for
    $display(integral_1^oo f(x) thin d x)$.
    Why?
  + Show that #h(.25em)
    $display(integral_1^oo f(x) d x)$
    #h(.25em) is convergent
     #v(0.1cm)

     #emph[Hint:] Use the definition of
     improper integral, not comparison tests.
     Use integration by parts with $u = 1/x$
     and $d v = sin x thin d x$.

  #[
    #set text(size: 10pt)
    #emph[Note:] It is possible to prove that
    #h(.25em)
    $display(integral_1^oo (sin x)/x thin d x)$
    is not absolutely convergent.
  ]
]
