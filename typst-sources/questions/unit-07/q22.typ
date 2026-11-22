#question(title: [The “$epsilon$--characterization" of
integrability], shrink: true)[
  #set text(size: 11pt)

  #slide-block(title: [#set text(size: 11pt)
  True or False?])[
    Let $f$ be a bounded function on
    $[a, b]$.
    + IF #h(1fr) “$forall epsilon > 0$,
      $exists$ a partition $P$ of $[a, b]$
      s.t.
      $display(U_P (f) - L_P (f) < epsilon)$",
       #v(0.1cm)

       THEN #h(.25em) $f$ is integrable on
       $[a, b]$
    + IF #h(1em) #h(1em) #h(.17em) $f$ is
      integrable on $[a, b]$
       #v(0.1cm)
        \

       #v(0.1cm)

       THEN #h(1fr) “$forall epsilon > 0$,
       $exists$ a partition $P$ of $[a, b]$
       s.t.
       $display(U_P (f) - L_P (f) < epsilon)$".
  ]

  #v(.5em)

  #align(center)[
    #{
      import "@preview/cetz:0.5.3": canvas, draw, decorations
      let (lo, up) = (-1.04, 1.04)
      let arrow = (end: "stealth", fill: black)
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
        content((0, -.75), $<=$)
        line((lo - 3.5, -1.4), (lo, -1.4), mark: arrow, stroke: 1.5pt)
        content((lo - 1.75, -1.95), text(size: 12pt)[finer partitions])
        line((up + 3.5, -1.4), (up, -1.4), mark: arrow, stroke: 1.5pt)
        content((up + 1.75, -1.95), text(size: 12pt)[finer partitions])
      })
    }
  ]
]
