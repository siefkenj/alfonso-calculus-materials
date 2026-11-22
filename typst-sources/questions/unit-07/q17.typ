#question(title: [Equations for lower and upper sums])[
  #set text(size: 13pt)

  Let $f$ be a #strong[decreasing], bounded
  function on $[a, b]$.  \
  Let
  $display(P = {x_0 comma x_1 comma ... comma x_N})$
  be a partition of $[a, b]$

  Which ones are a valid equation for
  $L_P (f)$? For $U_P (f)$?

  #grid(
    columns: 3,
    column-gutter: 1em,
    [
      + $display(sum_(i = 0)^N f(x_i) thin Delta x_i)$
      + $display(sum_(i = 1)^N f(x_i) thin Delta x_i)$
    ],
    [
      3. $display(sum_(i = 0)^(N - 1) f(x_i) thin Delta x_i)$
      + $display(sum_(i = 1)^N f(x_(i + 1)) thin Delta x_i)$
    ],
    [
      5. $display(sum_(i = 1)^N f(x_(i - 1)) thin Delta x_i)$
      + $display(sum_(i = 0)^(N - 1) f(x_i) thin Delta x_(i + 1))$
    ],
  )

  Recall:
  $display(Delta x_i = x_i - x_(i - 1))$.
]
