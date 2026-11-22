#question(title: [Which one is the correct claim?], centered: true)[
  #slide-block(title: [Claim 1?])[
    (Assuming these limits exist)
    $
      lim_(x -> a) g(f(x)) thick = thick g(lim_(x -> a) f(x))
    $
  ]

  #v(1fr)

  #slide-block(title: [Claim 2?])[
    #table(
      columns: 3,
      align: (left, left, left),
      stroke: none,
      [IF], [#text(fill: blue)[(A)] $display(lim_(x -> a) f(x) = L)$, #h(1em)
      and], [#text(fill: blue)[(B)]
      $display(lim_(t -> L) g(t) = M)$],
      [THEN], [#text(fill: blue)[(C)]
      $display(lim_(x -> a) g(f(x)) = M thick)$], [],
    )
  ]
]
