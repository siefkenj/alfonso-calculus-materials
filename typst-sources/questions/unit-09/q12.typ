#question(title: [A reduction formula])[
  #set text(size: 13pt)

  Let
  $display(I_n = integral_0^(2 pi) sin^n x thin d x)$.
  #v(0.3cm)

  #set enum(spacing: .55em + 0.3cm)
  + Compute $I_0$ and $I_1$.
     #v(0.3cm)
  + Write an equation for $display(I_n)$ in
    terms of $display(I_(n - 2))$. This is
    called a reduction formula.
     #v(0.3cm)

     #emph[Hint:] Starting with $I_n$, use
     integration by parts once.  \
     Then use
     $display(sin^2 x + cos^2 x = 1)$ to
     rewrite the new integral in terms of
     $display(I_n)$ and $display(I_(n - 2))$.
  + Write a a formula for $I_n$ for all
    natural numbers $n$.
]
