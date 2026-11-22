#question(title: [Choosing deltas again])[
  Let us fix numbers $A, epsilon > 0$. Find:

  #v(1fr)

  #set enum(spacing: .55em + 0.15cm)
  + a value of $delta > 0$ #h(.25em) s.t.
    #h(1fr)
    $display(abs(x) < delta ==> abs(A x^2) < epsilon)$
  + #emph[all] values of $delta > 0$
    #h(.25em) s.t. #h(1fr)
    $display(abs(x) < delta ==> abs(A x^2) < epsilon)$
  + a value of $delta > 0$ #h(.25em) s.t.
    #h(1fr)
    $display(abs(x) < delta ==> abs(x + 1) < 10)$
  + #emph[all] values of $delta > 0$
    #h(.25em) s.t. #h(1fr)
    $display(abs(x) < delta ==> abs(x + 1) < 10)$
  + a value of $delta > 0$ #h(.25em) s.t.
    #h(1fr)
    $display(abs(x) < delta ==> lr(\{mat(delim: #none, align: #center, abs(A x^2) < epsilon; abs(x + 1) < 10)))$
  + a value of $delta > 0$ #h(.25em) s.t.
    #h(1fr)
    $display(abs(x) < delta ==> abs((x + 1) x^2) < epsilon)$

  #v(1fr)
]
