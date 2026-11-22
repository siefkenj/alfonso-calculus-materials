#question(title: [What can you conclude?], shrink: true)[
  #set text(size: 13pt)

  Let $a in RR$. Let $f$ be a continuous,
  #strong[positive] function on $[a, oo)$.  \
  In each of the following cases, what can
  you conclude about
  $display(integral_a^oo f(x) d x)$?
  #h(.25em) Is it convergent, divergent, or
  we do not know?

  #set enum(spacing: .55em + 0.3cm)
  + $display(forall b >= a comma thick exists M in RR thick " s.t. " thick quad integral_a^b f(x) thin d x thick <= thick M)$.
  + $display(exists M in RR thick " s.t. " thick forall b >= a comma thick quad integral_a^b f(x) thin d x thick <= thick M)$.
  + $display(exists M > 0 thick " s.t. " thick quad forall x >= a comma thick f(x) <= M)$.
  + $display(exists M > 0 thick " s.t. " thick quad forall x >= a comma thick f(x) >= M)$.
]
