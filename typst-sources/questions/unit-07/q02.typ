#question(title: [Re-writing sums])[
  #set text(size: 13pt)

  #set enum(spacing: .55em + 0.3cm)
  + $display(sum_(i = 1)^100 tan i thin - thin sum_(i = 1)^50 tan i thick = thick sum_#boxed[$display(#hide[$display(? ? ?)$])$]^#boxed[$display(#hide[$display(? ? ?)$])$] #boxed[$display(#hide[$display(? ? ? ? ?_p^f)$])$])$
  + $display(sum_(i = 1)^N (2 i - 1)^5 thick = thick sum_(i = 0)^(N - 1) #boxed[$display(#hide[$display(? ? ? ? ?_p^f)$])$])$
  + $display([sum_(k = 1)^N x^k] thin + thin [sum_(k = 0)^N k thick x^(k + 1)] thick = thick [sum_(k = #boxed[$display(#hide[$display(? ? ?)$])$])^#boxed[$display(#hide[$display(? ? ?)$])$] #boxed[$display(#hide[$display(? ? ?)$])$] thin x^k] thin + thin #boxed[$display(#hide[$display(? ? ?)$])$])$

  #v(1fr)

  #emph[Hint:] Write out the sums on the left
  hand side first, simplify if possible, then
  write them back into sigma notation.
]
