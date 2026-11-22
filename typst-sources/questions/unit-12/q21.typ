#question(title: [Absolute Convergence], shrink: true)[
  #set text(size: 12pt)

  #slide-block(title: [#set text(size: 12pt)
  Definition])[The integral
  $display(integral_a^oo f(x) thin d x)$ is
  called
  #strong[absolutely convergent] when
  $display(integral_a^oo abs(f(x)) thin d x)$
  converges.]

  Prove that
  - IF an improper integral is absolutely
    convergent
  - THEN it is convergent

  #v(0.5cm)

  #emph[Hint:] Consider the functions
  $
    f_+ (x) = cases(f(x) & quad " if " f(x) >= 0, 0 & quad " if " f(x) <= 0) quad quad f_- (x) = cases(0 & quad " if " f(x) >= 0, abs(f(x)) & quad " if " f(x) <= 0)
  $
  Write $f(x)$ and $abs(f(x))$ in terms of
  $f_+ (x)$ and $f_- (x)$. Use BCT.
]
