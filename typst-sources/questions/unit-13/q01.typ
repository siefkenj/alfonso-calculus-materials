#question(title: [What is wrong with this calculation? Fix it])[
  #set text(size: 13pt)

  #strong[Claim:] #h(.25em)
  $display(sum_(n = 2)^oo ln n/(n + 1) thin = thin ln 2)$

  #slide-block(title: [“Proof"])[
    $
      sum_(n = 2)^oo ln n/(n + 1) thick &= thick sum_(n = 2)^oo [ln n - ln(n + 1)] \ thick &= thick sum_(n = 2)^oo ln(n) thick - thick sum_(n = 2)^oo ln(n + 1) \ thick &= thick(ln 2 + ln 3 + ln 4 + ...) thick - thick(ln 3 + ln 4 + ...) #hide[$display(integral)$] \ thick &= thick ln 2
    $
  ]
]
