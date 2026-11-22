#question(title: [Is this proof correct?])[
  #strong[Claim:]
  $
    forall epsilon > 0, exists delta > 0 " s.t. " quad 0 < abs(x) < delta thick ==> thick abs(x^3 + x^2) < epsilon .
  $

  #v(1fr)

  #slide-block(title: [Proof:])[
    - Let $epsilon > 0$.
    - Take
      $display(delta = sqrt(epsilon/(abs(x + 1))))$.
    - Let $x in RR$. Assume
      $0 < abs(x) < delta$. Then
      $
        abs(x^3 + x^2) = x^2 abs(x + 1) < delta^2 abs(x + 1) = epsilon/(abs(x + 1)) abs(x + 1) = epsilon .
      $
    - I have proven that
      $display(abs(x^3 + x^2) < epsilon)$.
      #h(1fr) #h(1fr) $square$
  ]

  #v(1fr)
]
