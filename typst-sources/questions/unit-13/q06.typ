#question(title: [True or False -- Definition of series], shrink: true)[
  #set text(size: 12pt)

  Let $display(sum_(n = 0)^oo a_n)$ be a
  series. Let $display({S_n}_(n = 0)^oo)$ be
  its partial-sum sequence.

  #set enum(spacing: .55em + 0.5cm)
  + IF #text(fill: blue)[the series
    $display(sum_(n = 0)^oo a_n)$ is
    convergent],  \
     THEN #text(fill: red)[the sequence
     $display({S_n}_(n = 0)^oo)$ is bounded].
  + IF #text(fill: blue)[the series
    $display(sum_(n = 0)^oo a_n)$ is
    convergent],  \
     THEN #text(fill: red)[the sequence
     $display({S_n}_(n = 0)^oo)$ is
     eventually monotonic].
     #v(0.8cm)
  + IF #text(fill: red)[the sequence
    $display({S_n}_(n = 0)^oo)$ is bounded
    and
    eventually monotonic],  \
     THEN #text(fill: blue)[the series
     $display(sum_(n = 0)^oo a_n)$ is
     convergent].
]
