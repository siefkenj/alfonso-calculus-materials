#question(title: [Cards], centered: true)[
  Take a look at the following cards.

  #align(center, stack(
    dir: ltr,
    spacing: 1.5cm,
    ..("E", "3", "P", "8").map(card => box(
      width: 1.5cm,
      height: 2cm,
      stroke: 1.2pt,
      align(center + horizon, text(size: 30pt, card)),
    )),
  ))

  Each card has a letter on one side and a
  number on the other, and I tell you:

  #v(.5em)

  #slide-block()[
    #emph[“#strong[If] a card has a vowel on
    one side,  \
    #strong[then] it has an odd number on the
    other side."]
  ]

  #v(.5em)
  Which cards do you need to turn over in
  order to verify whether I am telling the
  truth or not?
]
