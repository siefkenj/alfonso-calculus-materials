#question(title: [Interval of convergence])[
  Find the interval of convergence of each
  power series:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      #set enum(spacing: .55em + 0.5cm)
      + $display(sum_(n = 0)^oo (x^n)/(n!))$
      + $display(sum_(n = 1)^oo ((x - 5)^n)/(n^2 thin 2^(2 n + 1)))$
    ],
    [
      #set enum(spacing: .55em + 0.5cm)
      3. $display(sum_(n = 1)^oo (n^n)/(42^n) x^n)$
      + (Hard!)
        $display(sum_(n = 0)^oo ((3 n)!)/(n!(2 n)!) thin x^n)$
    ],
  )
]
