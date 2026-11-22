#question(title: [Generalize your proof], shrink: true)[
  #set text(size: 13pt)

  #slide-block(title: [Theorem])[
    Let $I$ be an open interval. Let
    $a in I$. Let $f$ be a $C^oo$ function on
    $I$.

    Let $S(x)$ be the Taylor series for $f$
    centered at $a$.

    - IF #boxed[$display(? ? ?)$]
    - THEN
      $display(forall x in I comma thick f(x) = S(x))$
  ]

  #v(0.2cm)

  Which condition can you write instead of
  “#boxed[$display(? ? ?)$]" to make the
  theorem true?

  #v(0.2cm)

  If you are thinking “the derivatives must
  be bounded", then you are on the right
  track, but you need to be much more
  precise. Which derivatives? On which
  domain? There are a lot of variables here;
  can the bounds depend on any variable?
]
