#question(title: [Fix these FALSE statements])[
  #set text(size: 13pt)
  // "sup of f" over "on [a, b]" in small type, as LaTeX's \substack.
  #let sup-on(of, on) = box(baseline: 35%, text(size: .7em, stack(
    spacing: .35em, align(center)[$sup$ of
    #of], align(center)[on #on],
  )))

  #set enum(spacing: .55em + 0.65cm)
  + Let $f$ and $g$ be bounded functions on
    $[a, b]$. Then
     $
       #sup-on[$(f + g)$][$[a, b]$] quad = quad #sup-on[$f$][$[a, b]$] quad + quad #sup-on[$g$][$[a, b]$]
     $
  + Let $a < b < c$. Let $f$ be a bounded
    function on $[a, c]$. Then
    $
      #sup-on[$f$][$[a, c]$] quad = quad #sup-on[$f$][$[a, b]$] quad + quad #sup-on[$f$][$[b, c]$]
    $
  + Let $f$ be a bounded function on
    $[a, b]$. Let $c in RR$. Then:
    $
      #sup-on[$(c f)$][$[a, b]$] quad = quad c thin lr(( #sup-on[$f$][$[a, b]$] ))
    $
]
