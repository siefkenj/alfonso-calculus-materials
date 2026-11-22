#question(title: [Variations on induction], centered: true)[
  Let $S_n$ be a statement depending on a
  positive integer $n$.

  #v(1fr)

  In each of the following cases, which
  statements are guaranteed to be true?

  #v(1fr)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + We have proven:
         - $S_3$
         - #box($display(forall n >= 1 comma thick S_n ==> S_(n + 1))$)
      + We have proven:
         - $S_1$
         - #box($display(forall n >= 3 comma thick S_n ==> S_(n + 1))$)
    ],
    [
      3. We have proven:
         - $S_1$
         - #box($display(forall n >= 1 comma thick S_n ==> S_(n + 3))$)
      + We have proven:
         - $S_1$
         - #box($display(forall n >= 1 comma thick S_(n + 1) ==> S_n)$)
    ],
  )

  #v(1fr)
]
