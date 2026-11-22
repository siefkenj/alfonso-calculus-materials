#question(title: [Fubini-Tonelli])[
  #set text(size: 13pt)

  - $A_(i, k)$ is a function of 2 variables.
    #h(.25em) For example,
    $display(A_(i comma k) = i/(k + i^2))$.
  - Decide what to write instead of each
    “#boxed[$display(#[#text(fill: red)[?]])$]”
    so that the following identity is true:

  #[
    #set text(size: 20pt)

    $
      sum_(i = 1)^N thick sum_(k = 1)^i A_(i, k) = sum_(k = #boxed[$display(#text(fill: red)[$display(?)$])$])^#boxed[$display(#text(fill: red)[$display(?)$])$] thick sum_(i = #boxed[$display(#text(fill: red)[$display(?)$])$])^#boxed[$display(#text(fill: red)[$display(?)$])$] A_(i, k)
    $
  ]
]
