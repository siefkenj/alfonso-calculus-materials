#question(title: [Sequences vs functions -- convergence])[
  For any function $f$ with domain $[0, oo)$,
   \
  we define a sequence as $a_n = f(n)$.  \
  Let $L in RR$. Which of these implications
  is true?

  #set enum(spacing: .55em + 1cm)
  + IF $display(lim_(x -> oo) f(x) = L)$,
    #h(.25em) THEN
    $display(lim_(n -> oo) a_n = L)$.
  + IF $display(lim_(n -> oo) a_n = L)$,
    #h(.25em) THEN
    $display(lim_(x -> oo) f(x) = L)$.
  + IF $display(lim_(n -> oo) a_n = L)$,
    #h(.25em) THEN
    $display(lim_(n -> oo) a_(n + 1) = L)$.
]
