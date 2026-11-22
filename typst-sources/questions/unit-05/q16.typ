#question(title: [Car race - Is this proof correct?], shrink: true)[
  #set text(size: 13pt)

  #slide-block(title: [#set text(size: 13pt)
  Claim])[IF two drivers start a race at the
  same moment and finish in a tie,
  THEN at some point in the race (not
  counting the starting time) they had
  exactly the same speed.]

  #strong[Proof?]
  - Let $f(t)$ and $g(t)$ be the positions of
    the two cars at time $t$.
  - Assume the race happens in the interval
    $[t_1 , t_2]$. By hypothesis:
    $
      f(t_1) = g(t_1), quad quad f(t_2) = g(t_2) .
    $
  - Using MVT, there exists $c in(t_1 , t_2)$
    such that
    $
      f' (c) = (f(t_2) - f(t_1))/(t_2 - t_1) , quad g' (c) = (g(t_2) - g(t_1))/(t_2 - t_1) .
    $
  - Then $f' (c) = g' (c)$. #h(1fr) $square$
]
