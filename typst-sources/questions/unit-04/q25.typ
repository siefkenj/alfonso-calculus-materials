#question(title: [Trig-inverse-trig])[
  #slide-block()[
    Find simple expressions for these
    quantities and state the domain on which
    they are valid:

    #grid(
      columns: 2,
      column-gutter: 1em,
      [
        + $display(sin thick(arccos x))$
        + $display(sec thick(arccos x))$
      ],
      [
        3. $display(sec thick(arctan x))$
        + $display(tan thick(op("arcsec") x))$
      ],
    )
  ]

  #[
    #set text(size: 13pt)
    #emph[Hint:] There are two standard ways
    to attack these problems:
    - Use a trig identity  \
      e.g.: a trig identity relating $sin$
      and $cos$ for (1)
    - Or draw a right triangle with side
      lengths $1$ and $x$  \
      e.g.: with an angle $theta$ such that
      $cos theta = x$ for (1)

    If you need to take a square root, you
    must justify which branch ($+$ or $-$)
    you are choosing.
  ]
]
