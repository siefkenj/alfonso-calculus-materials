#question(title: [What is wrong with this “proof"?], centered: true)[
  #set text(size: 13pt)

  #slide-block()[
    Prove that
    $
      lim_(x -> 3) (5 x + 1) = 16
    $
  ]

  #slide-block(title: [“Proof:"])[
    Let $epsilon > 0$.

    WTS $forall epsilon > 0$,
    $exists delta > 0$ s.t.
    $
      0 < abs(x - 3) < delta ==> abs((5 x + 1) -(16)) < epsilon
    $

    $
      abs((5 x + 1) -(16)) < epsilon & <==> abs(5 x + 15) < epsilon \ & <==> 5 abs(x + 3) < epsilon ==> delta = epsilon/3
    $
    #h(1fr) $square$
  ]
]
