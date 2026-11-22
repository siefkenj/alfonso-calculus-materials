#question(title: [What is wrong with this proof by
induction?], centered: true, shrink: true)[
  #set text(size: 13pt)

  #theorem()[$forall N >= 1$, every set of $N$ students in MAT137 will get the
  same grade.]

  #proof[
    - #strong[Base case.] It is clearly true
      for $N = 1$.
    - #strong[Induction step.]  \
      Assume it is true for $N$. I'll show it
      is true for $N + 1$.  \
      Take a set of $N + 1$ students. By
      induction hypothesis:
      - The first $N$ students get the same
        grade.
      - The last $N$ students get the same
        grade.

      $
        #box(width: 0pt)[$overbrace(#hide[$display(bullet quad bullet quad dots.c quad bullet quad bullet)$], "Same grade")$] bullet quad underbrace(bullet quad bullet quad dots.c quad bullet quad bullet, "Same grade")
      $
      Hence the $N + 1$ students all get the
      same grade.
  ]
]
