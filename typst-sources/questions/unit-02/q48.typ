#question(title: [Trig computations], centered: true)[
  Using that
  $display(lim_(x -> 0) (sin x)/x = 1)$,
  compute the following limits:

  #grid(
    columns: 2,
    column-gutter: 1em,
    [
      + $display(lim_(x -> 2) (sin x)/x)$
      + $display(lim_(x -> 0) (sin(5 x))/x)$
      + $display(lim_(x -> 0) (tan^2 (2 x^2))/(x^4))$
    ],
    [
      4. $display(lim_(x -> 0) (sin e^x)/(e^x))$
      + $display(lim_(x -> 0) (1 - cos x)/x)$
      + $display(lim_(x -> 0) (tan^10 (2 x^20))/(sin^200 (3 x)))$
    ],
  )

  7. #[
       #set text(size: 12pt)
       $display(lim_(x -> 0) [(sin x) thick(cos(2 x)) thick(tan(3 x)) thick(sec(4 x)) thick(csc(5 x)) thick(cot(6 x))])$
     ]
]
