#question(title: [Add these series])[
  #set text(size: 13pt)

  #set enum(spacing: .55em + 0.25cm)
  + $display(sum_(n = 2)^oo ((- 2)^n)/((2 n + 1)!))$
    #h(1fr) #emph[Hint:] Think of $sin$
  + $display(sum_(n = 0)^oo (4 n + 1) x^(4 n + 2))$
    #h(1fr) #emph[Hint:]
    $display(d/(d x) [x^(4 n + 1)] = ? ? ?)$
  + $display(sum_(n = 0)^oo 1/((2 n)!))$
    #h(1fr) #emph[Hint:] Write first few
    terms. Combine $display(e^1)$ and
    $display(e^(-1))$.
  + $display(sum_(n = 0)^oo ((- 1)^n x^(2 n))/((2 n)!(n + 1)))$
    #h(1fr) #emph[Hint:] Integrate

  #v(1fr)
]
