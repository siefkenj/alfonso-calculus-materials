#question(title: [Symmetry])[
  Calculate the value of these integrals
  #emph[without computing any
  antiderivative].

  #grid(
    columns: 3,
    column-gutter: 1em,
    [
      + $display(integral_(-2)^2 sin x^3 d x)$
    ],
    [
      2. $display(integral_0^pi cos^2 x thin d x)$
    ],
    [
      3. $display(integral_(-1)^1 arccos x thin d x)$
    ],
  )

  #emph[Hint:] Sketch the graphs (use desmos)
  and use symmetry to compute the integral.
   \
  Once you guess the symmetry of the graph,
  try to write it algebraically.
  #h(1fr) #link("https://www.desmos.com/calculator/ncysdsu3yv")[#goto-button[1]]
  #link("https://www.desmos.com/calculator/fwjs5zoury")[#goto-button[2]]
  #link("https://www.desmos.com/calculator/tjakgza6vf")[#goto-button[3]]
]
