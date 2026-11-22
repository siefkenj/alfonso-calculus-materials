#question(title: [Harmonic sums])[
  #set text(size: 13pt)

  We define the $N$-th Harmonic term as the
  sum
  $
    H_N thick = thick 1 + 1/2 + 1/3 + ... + 1/N thick = thick sum_(i = 1)^N 1/i .
  $

  Write the following sums in terms of
  harmonic terms.

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(sum_(i = k)^N thick 1/i)$
      + $display(1/2 + 1/4 + 1/6 + ... + 1/(2 N))$
    ],
    [
      3. $display(sum_(i = 1)^N thick 1/(2 i - 1))$
      + $display(sum_(i = 1)^(2 N) thick ((- 1)^(i + 1))/i)$
    ],
  )
]
