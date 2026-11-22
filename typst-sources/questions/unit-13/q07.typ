#question(title: [True or False -- Definition of series], shrink: true)[
  #set text(size: 12pt)

  Let $display(sum_(n = 0)^oo a_n)$ be a
  series. Let $display({S_n}_(n = 0)^oo)$ be
  its partial-sum sequence.

  #set enum(spacing: .55em + 0.5cm)
  4. IF
     #text(fill: blue)[$display(forall n > 0)$,
     $display(a_n > 0)$],
     #v(0.2cm)

     THEN #text(fill: red)[the sequence
     $display({S_n}_(n = 0)^oo)$ is
     increasing].
  + IF #text(fill: red)[the sequence
    $display({S_n}_(n = 0)^oo)$ is
    increasing],
     \

     #v(0.2cm)

     THEN
     #text(fill: blue)[$display(forall n > 0)$,
     $display(a_n > 0)$].
  + IF
    #text(fill: blue)[$display(forall n > 0)$,
    $display(a_n >= 0)$],
     #v(0.2cm)

     THEN #text(fill: red)[the sequence
     $display({S_n}_(n = 0)^oo)$ is
     non-decreasing].

  + IF #text(fill: red)[the sequence
    $display({S_n}_(n = 0)^oo)$ is
    non-decreasing],  \

     #v(0.2cm)

     THEN
     #text(fill: blue)[$display(forall n > 0)$,
     $display(a_n >= 0)$]
]
