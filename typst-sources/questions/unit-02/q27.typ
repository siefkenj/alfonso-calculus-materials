#question(title: [Indeterminate form])[
  Let $a in RR$. Let $f$ and $g$ be positive
  functions defined near $a$, except maybe at
  $a$.

  #v(1fr)

  Assume
  $display(lim_(x -> a) f(x) = lim_(x -> a) g(x) = 0)$.

  #v(1fr)

  What can we conclude about #h(1em)
  $display(lim_(x -> a) (f(x))/(g(x)))$ ?

  #v(1fr)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + The limit is $1$.
      + The limit is $0$.
      + The limit is $oo$.
    ],
    [
      4. The limit does not exist.
      + We do not have enough information to
        decide.
    ],
  )
]
