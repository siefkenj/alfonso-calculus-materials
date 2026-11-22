#question(title: [Critique this proof])[
  #set text(size: 13pt)

  $
    h' (a) thick &= thick lim_(x -> a) (h(x) - h(a))/(x - a) thick = thick lim_(x -> a) (thick frac(f(x), g(x)) thick - thick frac(f(a), g(a)) thick)/(x - a) \ med \ &= thick lim_(x -> a) (f(x) g(a) - f(a) g(x))/(g(x) g(a) thick(x - a)) \ med \ &= thick lim_(x -> a) (f(x) g(a) - f(a) g(a) + f(a) g(a) - f(a) g(x))/(g(x) g(a) thick(x - a)) \ med \ &= thick lim_(x -> a) {[(f(x) - f(a))/(x - a) g(a) - f(a) (g(x) - g(a))/(x - a)] 1/(g(x) g(a))} \ med \ &= thick [f' (a) g(a) - f(a) g' (a)] 1/(g(a) g(a))
  $
]
