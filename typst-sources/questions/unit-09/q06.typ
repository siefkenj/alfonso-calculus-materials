#question(title: [Persistence])[
  Compute
  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      - $display(integral_1^e (ln x)^3 d x)$
    ],
    [
      - $display(integral_1^e (ln x)^10 d x)$
    ],
  )
  There is a more efficient approach. Call
  $
    I_n = integral_1^e (ln x)^n d x
  $
  Use integration by parts on $I_n$. You will
  get an equation with $I_n$ and $I_(n - 1)$.
  Now solve the previous questions.

  #v(1fr)
  #h(1fr) #link("https://oeis.org/")[#goto-button[OEIS]]
]
