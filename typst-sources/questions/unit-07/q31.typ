#question(title: [Compute $integral_1^2 x^2 d x$ using Riemann
sums], shrink: true)[
  #set text(size: 13pt)

  #slide-block()[
    Let $display(f(x) = x^2)$ on $[1, 2]$.
    Let $P_n$ be the partition that breaks
    $[1, 2]$ into $n$ subintervals of equal
    length.
    + Write a explicit formula for $P_n$.
    + What is $Delta x_i$?
    + Write the Riemann sum
      $display(S_(P_n)^* (f))$ with sigma
      notation  \
       (choose $x_i^*$ as the right
       endpoint).
    + Add the sum
    + Compute
      $display(lim_(n -> oo) S_(P_n)^* (f))$.
    + Repeat the last 3 questions when we
      choose $x_i^*$ as the left endpoint.
  ]
  #[
    #set text(size: 10pt)
    #emph[Helpful identities:]
    $display(quad sum_(i = 1)^N i = (N(N + 1))/2 comma quad quad sum_(i = 1)^N i^2 = (N(N + 1)(2 N + 1))/6)$
  ]
]
