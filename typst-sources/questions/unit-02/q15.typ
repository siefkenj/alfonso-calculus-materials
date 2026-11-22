#question(title: [Infinite limits - 2])[
  Which one(s) is the definition of
  $display(lim_(x -> a) f(x) = oo)$ ?
  #v(1fr)

  #set enum(spacing: .55em + 0.2cm)
  + $display(forall M in RR comma thin exists delta > 0 thick " s.t. " 0 < abs(x - a) < delta thick ==> thick f(x) > M)$
  + $display(forall M in ZZ comma thin exists delta > 0 thick " s.t. " 0 < abs(x - a) < delta thick ==> thick f(x) > M)$
  + $display(forall M > 0 comma thin exists delta > 0 thick " s.t. " 0 < abs(x - a) < delta thick ==> thick f(x) > M)$
  + $display(forall M > 5 comma thin exists delta > 0 thick " s.t. " 0 < abs(x - a) < delta thick ==> thick f(x) > M)$

  #v(1fr)
]
