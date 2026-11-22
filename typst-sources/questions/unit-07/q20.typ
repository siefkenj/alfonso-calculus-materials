#question(title: [A tricky question], shrink: true)[
  #set text(size: 13pt)

  Let $f$ be a bounded function on $[a, b]$.
  Which statement is true?

  + There exists a partition $P$ of $[a, b]$
    such that
     $
       underline(I_a^b) (f) = L_P (f) quad quad "and" quad quad overline(I_a^b) (f) = U_P (f) .
     $
  + There exist partitions $P$ and $Q$ of
    $[a, b]$ such that
     $
       underline(I_a^b) (f) = L_P (f) quad quad "and" quad quad overline(I_a^b) (f) = U_Q (f) .
     $
  + There exists a partition $P$ of $[a, b]$
    such that
     $
       underline(I_a^b) (f) = L_P (f) .
     $

  #align(center)[
    #{
      import "@preview/cetz:0.5.3": canvas, draw, decorations
      let (lo, up) = (-1.04, 1.04)
      canvas(length: 1cm, {
        import draw: *
        line((-5, 0), (5, 0), stroke: 1pt)
        for d in (2.5, 3.3, 2.0, 1.8, 1.3, .8, .5, .2, .05) {
          circle((lo - d, 0), radius: .1, fill: red, stroke: none)
        }
        for d in (2.7, 3.1, 1.8, 1.5, 1.2, .7, .4, .2, .03) {
          circle((up + d, 0), radius: .1, fill: verde, stroke: none)
        }
        decorations.brace((lo - 3.5, .35), (lo, .35), amplitude: .35)
        content((lo - 1.75, 1.1), text(fill: red)[lower sums])
        decorations.brace((up, .35), (up + 3.5, .35), amplitude: .35)
        content((up + 1.75, 1.1), text(fill: verde)[upper sums])
        line((-1, .3), (-1, -.3), stroke: 1.5pt)
        content((-1, -.75), $underline(I_a^b) (f)$)
        line((1, .3), (1, -.3), stroke: 1.5pt)
        content((1, -.75), $overline(I_a^b) (f)$)
      })
    }
  ]
]
