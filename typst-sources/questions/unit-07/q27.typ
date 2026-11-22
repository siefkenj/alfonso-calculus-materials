#question(title: [Example 3: a very non-continuous function], shrink: true)[
  #set text(size: 13pt)

  Consider the function $f$ defined on
  $[0, 1]$:
  $
    f(x) = cases(1 \/ 2 & quad " if " 0 <= x <= 1 \/ 2, 1 & quad " if " 1 \/ 2 < x <= 1 " and " x in QQ, 0 & quad " if " 1 \/ 2 < x <= 1 " and " x in.not QQ)
  $

  + Draw a picture!
  + Let
    $display(P = {0 comma 0.2 comma 0.4 comma 0.6 comma 0.8 comma 1})$.
    Calculate $display(L_P (f))$ and
    $display(U_P (f))$.
  + Construct a partition $P$ such that
    $display(L_P (f) = 1/4)$ and
    $display(U_P (f) = 3/4)$
  + What is the upper integral,
    $overline(I_0^1) (f)$?
  + What is the lower integral,
    $underline(I_0^1) (f)$?
  + Is $f$ integrable on $[0, 1]$?
]
