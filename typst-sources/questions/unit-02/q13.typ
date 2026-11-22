#question(title: [Side limits], centered: true)[
  #slide-block(title: [Recall])[
    Let $L, a in RR$.  \
    Let $f$ be a function defined at least on
    an interval around $a$, except possibly
    at $a$.  \

    $
      lim_(x -> a) f(x) = L
    $
    means
    $
      forall epsilon > 0, exists delta > 0 " s.t. " quad 0 < abs(x - a) < delta ==> abs(f(x) - L) < epsilon .
    $
  ]

  #v(1fr)

  Write, instead, the formal definition of
  $
    lim_(x -> a^+) f(x) = L, quad " and " quad lim_(x -> a^-) f(x) = L .
  $
]
