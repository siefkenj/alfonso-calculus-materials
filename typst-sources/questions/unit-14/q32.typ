#question(title: [Secant])[
  #set text(size: 13pt)

  I want to obtain the first few terms of the
  Maclaurin series of
  $display(f(x) = sec x)$. Notice that
  #math.equation(block: true, numbering: "(1)", $ sec x thick = thick 1/(cos x) thick = thick 1/(1 - [1 - cos x]) thick = thick 1/(1 - u) $)
  <eq:sec> where I have called
  $display(u = 1 - cos x)$. #h(.25em) Notice
  that as $x -> 0$, $u -> 0$.
  #v(0.2cm)

  Use the geometric series in
  (#ref(<eq:sec>, supplement: none)). Then
  write $u$ as a power series centered at 0.
  Then expand and regroups terms.
  #v(0.5cm)

  + Use the above to obtain the 6-th
    Maclaurin polynomial for $f$.
  + Without taking any derivative, what is
    $display(f^((6)) (0))$?
]
