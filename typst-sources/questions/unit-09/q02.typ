#question(title: [Definite integral via
substitution], centered: true, shrink: true)[
  #set text(size: 13pt)

  This final answer is right, but the
  write-up is WRONG. Why?
  #v(.5em)

  Calculate
  $display(I = integral_0^2 sqrt(x^3 + 1) thick x^2 d x)$
  #slide-block(title: [Wrong answer])[
    Substitution:
    $display(u = x^3 + 1 comma thick d u = 3 x^2 d x)$.
    $
      I thick &= thick 1/3 integral_0^2 sqrt(x^3 + 1) thick(3 x^2 d x) & &= thick 1/3 integral_0^2 u^(1 \/ 2) thick d u \ &= thick 1/3 thick 2/3 thick lr(u^(3 \/ 2)|)_0^2 & &= thick lr(1/9 (x^3 + 1)^(2 \/ 3)|)_0^2 \ &= thick 2/9 (2^3 + 1)^(3 \/ 2) - 2/9 (0 + 1)^(3 \/ 2) & &= thick 52/9
    $
  ]
]
