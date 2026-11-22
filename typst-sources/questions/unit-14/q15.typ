#question(title: [Competition!])[
  #[
    #set text(size: 13pt)

    $
      C(x) & thin = thin - 293/8 thin + thin 29 x thin + thin 13/4 x^2 - 3 x^3 thin + thin 3/8 x^4 #hide[$display(integral)$] \ D(x) & thin = thin 29 thin + thin 8(x - 3) thin - thin 7/2 (x - 3)^2 thin + thin 9/6 (x - 3)^3 thin + thin 9/24 (x - 3)^4
    $
  ]

  #grid(
    columns: 2,
    column-gutter: 3em,
    [
      $C$-team compute...
      - $C(3)$
      - $C'(3)$
      - $C''(3)$
      - $C'''(3)$
      - $C^((4))(3)$
    ],
    [
      $D$-team compute...
      - $D(3)$
      - $D'(3)$
      - $D''(3)$
      - $D'''(3)$
      - $D^((4))(3)$
    ],
  )

  Simplify your answers (write them as
  rational numbers)
]
