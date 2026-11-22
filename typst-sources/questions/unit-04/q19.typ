#question(title: [More logarithmic differentiation])[
  #set text(size: 13pt)

  #slide-block()[
    Calculate the derivative of
    $
      f(x) = (sin x)^(cos x) + (cos x)^(sin x) .
    $
  ]

  #v(1fr)

  #strong[#underline[What is wrong with this
  answer?]]
  $
    ln f(x) = & (cos x) ln(sin x) + (sin x)(ln cos x) \ #text(fill: red)[$display(d/(d x))$] [ln f(x)] = & #text(fill: red)[$display(d/(d x))$] [(cos x) ln(sin x)] + #text(fill: red)[$display(d/(d x))$] [(sin x)(ln cos x)] \ (f' (x))/(f(x)) = & -(sin x) ln(sin x) + (cos x) (cos x)/(sin x) \ & +(cos x) ln(cos x) + (sin x) (-sin x)/(cos x)
  $

  $
    f' (x) = f(x) [-(sin x) ln(sin x) + (cos x) ln(cos x) + (cos^2 x)/(sin x) - (sin^2 x)/(cos x)]
  $
]
