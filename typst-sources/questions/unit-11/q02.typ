#question(title: [Definition of limit of a sequence], shrink: true)[
  #set text(size: 13pt)

  Let $display({a_n}_(n = 0)^oo)$ be a
  sequence. Let $display(L in RR)$.  \
  Which statements are equivalent to
  $display(“ {a_n}_(n = 0)^oo --> L ”)$?

  + $display(forall epsilon > 0 comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < epsilon .)$
  + $display(forall epsilon > 0 comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n thick #text(fill: red)[$display(>)$] thick n_0 ==> abs(L - a_n) < epsilon .)$
  + $display(forall epsilon > 0 comma thick exists n_0 in #text(fill: red)[$display(RR)$] comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < epsilon .)$
  + $display(forall epsilon > 0 comma thick exists n_0 in NN comma thick forall n in #text(fill: red)[$display(RR)$] comma thick quad n >= n_0 ==> abs(L - a_n) < epsilon .)$
  + $display(forall epsilon > 0 comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) thick #text(fill: red)[$display(<=)$] thick epsilon .)$
  + $display(forall epsilon thick #text(fill: red)[$display(in(0, 1))$] comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < epsilon .)$
  + $display(forall epsilon > 0 comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < #text(fill: red)[$display(1/epsilon)$] .)$
  + $display(forall #text(fill: red)[$display(k in ZZ^+)$] comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < #text(fill: red)[$display(k)$] .)$
  + $display(forall #text(fill: red)[$display(k in ZZ^+)$] comma thick exists n_0 in NN comma thick forall n in NN comma thick quad n >= n_0 ==> abs(L - a_n) < #text(fill: red)[$display(1/k)$] .)$
]
