#question(title: [Product of Taylor series])[
  Let $display(f(x) = e^x ln(1 + x))$
  #v(0.2cm)

  #set enum(spacing: .55em + 0.5cm)
  + Write the 4-th Taylor polynomial for $f$
    at $a = 0$.
     #v(0.2cm)

     #[
       #set text(size: 11pt)
       #emph[Hint:] Write the first few terms
       of the Maclaurin series for each
       factor and multiply them.
     ]
     #v(0.5cm)
  + What is $display(f^((4)) (0))$?
  + Use it to calculate the limit

     $
       lim_(x -> 0) (e^x ln(1 + x) + ln(1 - x))/(x^4)
     $
]
