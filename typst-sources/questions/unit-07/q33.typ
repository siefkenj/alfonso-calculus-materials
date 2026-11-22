#question(title: [The Mean Value Theorem for integrals], shrink: true)[
  #set text(size: 13pt)

  Prove the following theorem.

  #slide-block(title: [#set text(size: 13pt)
  Theorem])[
    Let $a < b$. Let $f$ be a continuous
    function on $[a, b]$.  \
    There exists $c in [a, b]$ such that

    $
      f(c) thick = thick 1/(b - a) integral_a^b f(t) d t
    $
  ]

  #emph[Hints:]
  + Compute $L_P (f)$ and $U_P (f)$ for the
    partition $display(P = {a comma b})$.
  + Use that
    $display(L_P (f) <= integral_a^b f(t) d t <= U_P (f))$
    to prove that

     $
       ? ? ? thick <= thick 1/(b - a) integral_a^b f(t) d t thick <= thick thick ? ? ?
     $
  + Use EVT and IVT.
]
