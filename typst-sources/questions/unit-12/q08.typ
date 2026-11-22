#question(title: [Probability])[
  #set text(size: 13pt)

  #set text(size: 13pt)

  A nonnegative function $f$ defined on
  $(- oo, oo)$ is called a
  #strong[probability density function] if

  $
    integral_(-oo)^oo f(x) thin d x = 1 .
  $
  The #emph[mean] of a probability density
  function is defined as

  $
    mu = integral_(-oo)^oo x thin f(x) thin d x .
  $
  Let
  $display(f(x) = cases(C e^(-k x) & quad " if " x >= 0, 0 & quad " if " x < 0))$
  + For $k > 0$, find a constant $C$ such
    that the function $f$ is a probability
    density function.
  + Calculate the mean $mu$.
]
