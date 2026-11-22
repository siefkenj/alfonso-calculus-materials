#question(title: [Proving a function is NOT one-to-one], shrink: true)[
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
  and I ask you to prove it is not
  one-to-one.You need to prove $f$ satisfies
  the #emph[negation] of the definition.
  - Write the negation of the first
    definition.
  - Write the negation of the second
    definition.
  - Write the structure of your proof.

  #v(.5em)

  #slide-block(title: [Exercise])[Prove that $f(x) = x^2$, with domain $RR$, is
  not one-to-one.]
]
