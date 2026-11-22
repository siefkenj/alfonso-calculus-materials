#question(title: [True or False - Absolute Values])[
  #set text(size: 13pt)

  #set enum(spacing: .55em + 0.5cm)
  + IF
    #text(fill: blue)[$display({a_n}_(n = 1)^oo)$]
    is convergent, #h(1em) THEN
    #text(fill: red)[$display({thin abs(a_n) thin}_(n = 1)^oo)$]
    is convergent.
  + IF
    #text(fill: red)[$display({thin abs(a_n) thin}_(n = 1)^oo)$]
    is convergent, #h(1em) THEN
    #text(fill: blue)[$display({a_n}_(n = 1)^oo)$]
    is convergent.
  + IF #h(.25em)
    #text(fill: blue)[$display(sum_(n = 1)^oo a_n)$]
    #h(.25em) is convergent, #h(1em) THEN
    #h(.25em)
    #text(fill: red)[$display(sum_(n = 1)^oo abs(a_n))$]
    #h(.25em) is convergent.
  + IF #h(.25em)
    #text(fill: red)[$display(sum_(n = 1)^oo abs(a_n))$]
    #h(.25em) is convergent, #h(1em) THEN
    #h(.25em)
    #text(fill: blue)[$display(sum_(n = 1)^oo a_n)$]
    #h(.25em) is convergent.
]
