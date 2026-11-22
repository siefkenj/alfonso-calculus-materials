#question(title: [Composition of Taylor series])[
  #set text(size: 13pt)

  Let $display(g(x) = e^(sin x))$.
  #v(0.2cm)

  + Write the 4-th Taylor polynomial for $g$
    at $a = 0$.
     #v(0.2cm)

     #[
       #set text(size: 11pt)
       #emph[Hint:] First use the Maclaurin
       series for the exponential. Then use
       the Maclaurin series for $sin$ and
       treat it like a polynomial. You only
       need to keep the first few terms.
     ]
     #v(0.2cm)
  + What is $display(g^((4)) (0))$?
  + Find a value of $a in RR$ such that the
    limit
     $
       lim_(x -> 0) (e^(sin x) - e^x + a x^3)/(x^4)
     $
     exists and is not 0. Then compute the
     limit.
]
