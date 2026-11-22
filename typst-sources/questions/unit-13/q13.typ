#question(title: [Challenge], shrink: true)[
  #set text(size: 13pt)

  We want to calculate the value of
  $
    A thin = thin sum_(n = 0)^oo 1/(2^n) , quad quad B thin = thin sum_(n = 1)^oo n/(2^n) , quad quad C thin = thin sum_(n = 1)^oo (n^2)/(2^n)
  $
  Let $display(f(x) = 1/(1 - x))$.

  #box(width: 1fr, line(length: 100%, stroke: .5pt))

  + Recall that #h(.17em)
    $display(f(x) = sum_(n = 0)^oo x^n)$
    #h(.17em) for $display(abs(x) < 1)$. Use
    it to compute $A$.
  + Pretend you can take derivatives of
    series the way you take them of finite
    sums. Write $display(f' (x))$ as a
    series.
  + Use it to compute $B$.
     #v(0.2cm)
  + Do something similar to compute $C$.
]
