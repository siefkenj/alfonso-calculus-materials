#question(title: [Practice: Integrals with trigonometric
functions], shrink: true)[
  #set text(size: 13pt)

  Compute the following antiderivatives.
  (Once you get them to a form from where you
  see a path to finish them, even if long,
  you may stop.)

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(integral sin^10 x cos x med d x)$
      + $display(integral sin^10 x cos^7 x thin d x)$
      + $display(integral e^(cos x) cos x sin^3 x thin d x)$
    ],
    [
      4. $display(integral cos^2 x thin d x)$
      + $display(integral cos^4 x thin d x)$
      + $display(integral csc x thin d x)$
    ],
  )

  #[
    #set text(size: 10pt)

    #slide-block(title: [#set text(size: 12pt)
    Useful trig identities])[
      $
        sin^2 x + cos^2 x = 1 & #h(3em) sin^2 x & = (1 - cos(2 x))/2 \
        tan^2 x + 1 = sec^2 x & #h(3em) cos^2 x & = (1 + cos(2 x))/2
      $
    ]
  ]
]
