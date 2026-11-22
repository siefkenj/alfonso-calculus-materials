#question(title: [Integral of products of secant and tangent])[
  To integrate
  $
    integral sec^n x tan^m x thin d x
  $

  - If
    #boxed[$display(#hide[$display(s p a c e s p a c e)$])$],
    then use the substitution
    $display(u = tan x)$.
  - If
    #boxed[$display(#hide[$display(s p a c e s p a c e)$])$],
    then use the substitution
    $display(u = sec x)$.

  #v(1fr)

  #[
    #set text(size: 13pt)
    #emph[Hint:] You will need

    #grid(
      columns: 2,
      column-gutter: 1em,
      [
        - $display(d/(d x) [tan x] = ...)$
      ],
      [
        - $display(d/(d x) [sec x] = ...)$
      ],
    )

    - The trig identity involving $sec$ and
      $tan$
  ]
]
