#question(title: [Proving a function is
one-to-one], centered: true, shrink: true)[
  #set text(size: 13pt)

  #slide-block(title: [Definition])[
    Let $f$ be a function with domain $D$.  \
    We say $f$ is one-to-one when
    - #h(1fr)
      $display(forall x_1 comma x_2 in D comma thick x_1 != x_2 ==> f(x_1) != f(x_2))$
    - OR, equivalently, #h(1fr)
      $display(forall x_1 comma x_2 in D comma thick f(x_1) = f(x_2) ==> x_1 = x_2)$
  ]

  #v(.5em)

  Suppose I give you a specific function $f$
  and I ask you to prove it is one-to-one.
  - Write the structure of your proof (how do
    you begin? what do you assume? what do
    you conclude?) if you use the first
    definition.
  - Write the structure of your proof if you
    use the second definition.

  #v(.5em)

  #slide-block(title: [Exercise])[Prove that $f(x) = 3 x + 2$, with domain $RR$,
  is one-to-one.]
]
