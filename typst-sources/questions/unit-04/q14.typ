#question(title: [Derivatives of the inverse function])[
  Let $f$ be a one-to-one function.  \
  Let $a, b in RR$ such that $b = f(a)$.

  #v(1fr)

  #set enum(spacing: .55em + 0.05cm)
  + Obtain a formula for
    $display((f^(-1))' (b))$ in terms of
    $display(f' (a))$.
     #v(0.2cm)

     #[
       #set text(size: 13pt)
       #emph[Hint:] This was done in Video
       4.4  \
       Take $display(d/(d y))$ of both sides
       of #h(1em)
       $display(f(f^(-1)(y)) = y)$.
     ]
  + Obtain a formula for
    $display((f^(-1))^(' ') (b))$ in terms
    of $display(f' (a))$ and
    $display(f^(' ') (a))$.
  + #emph[Challenge:] Obtain a formula for
    $display((f^(-1))^(' ' ') (b))$ in terms
    of $display(f' (a))$,
    $display(f^(' ') (a))$, and
    $display(f^(' ' ') (a))$.
]
