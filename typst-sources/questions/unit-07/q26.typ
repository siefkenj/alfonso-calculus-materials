#question(title: [Example 2: a non-continuous function], shrink: true)[
  #set text(size: 13pt)

  Consider the function #h(.25em)
  $display(f(x) = cases(0 & quad x = 0, 5 & quad 0 < x <= 1))$,
  #h(.25em)defined on $[0, 1]$.

  + Let
    $display(P = {0 comma 0.2 comma 0.5 comma 0.9 comma 1})$.
     #v(0.1cm)

     Calculate $display(L_P (f))$ and
     $display(U_P (f))$ for this partition.
  + Fix an arbitrary partition
    $P = {x_0 , x_1 , ..., x_N}$ of $[0, 1]$.
     \

     #v(0.1cm)

     What is $U_P (f)$? What is
     $display(L_P (f))$? (Draw a picture!)
  + Find a partition $P$ with exactly 3
    points (2 subintervals) such that
    $display(L_P (f) = 4.99)$.
  + What is the upper integral,
    $overline(I_0^1) (f)$?
  + What is the lower integral,
    $underline(I_0^1) (f)$?
  + Is $f$ integrable on $[0, 1]$?
]
