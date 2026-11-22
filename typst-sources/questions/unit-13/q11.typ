#question(title: [Decimal expansions of rational numbers])[
  #set text(size: 13pt)

  We can interpret any finite decimal
  expansion as a finite sum. For example:
  $
    2.13096 thin = thin 2 + 1/10 + 3/(10^2) + 0/(10^3) + 9/(10^4) + 6/(10^5)
  $
  Similarly, we can interpret any infinite
  decimal expansion as an infinite series.
  #v(0.5cm)

  Interpret the following numbers as series,
  and add up the series to calculate their
  value as fractions:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $0.99999 ...$
      + $0.11111 ...$
    ],
    [
      3. $0.252525 ...$
      + $0.3121212 ...$
    ],
  )

  #emph[Hint:] Use geometric series
]
