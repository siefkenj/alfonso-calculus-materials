#question(title: [A “simple" integral])[
  What is
  $display(integral_(-1)^1 1/x thin d x)$
  #h(.25em) ?

  #[
    #v(1fr)
    #set enum(spacing: .55em + 0.25cm)
    + $display(integral_(-1)^1 1/x thin d x thick = thick(ln abs(x)) |_(-1)^1 thick = thick ln abs(1) - ln abs(- 1) = 0)$
    + $display(integral_(-1)^1 1/x thin d x = 0)$
      #h(.25em) because
      $display(f(x) = 1/x)$ is an odd
      function.
    + $display(integral_(-1)^1 1/x thin d x)$
      is divergent.

    #v(1fr)
  ]
]
