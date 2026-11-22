#question(title: [Is this proof correct?], shrink: true)[
  #set text(size: 13pt)
  Let $display({R_n}_(n = 0)^oo)$ be the
  sequence in the previous slide.
  #slide-block(title: [Claim:])[$display({R_n}_(n = 0)^oo --> - 1 + sqrt(3))$.]

  #proof[
    #grid(
      columns: 2,
      column-gutter: 1em,
      [
        - Let
          $display(L = lim_(n -> oo) R_n)$.
        - $display(R_(n + 1) = (R_n + 2)/(R_n + 3))$
        - $display(lim_(n -> oo) R_(n + 1) = lim_(n -> oo) (R_n + 2)/(R_n + 3))$
        - $display(L = (L + 2)/(L + 3))$
      ],
      [
        - $display(L(L + 3) = L + 2)$
        - $display(L^2 + 2 L - 2 = 0)$
        - $display(L = - 1 plus.minus sqrt(3))$
        - $display(L)$ must be positive, so
          $display(L = - 1 + sqrt(3))$
      ],
    )
  ]
]
