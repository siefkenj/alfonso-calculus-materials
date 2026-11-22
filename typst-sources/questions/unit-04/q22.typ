#question(title: [Definition of $arctan$], shrink: true)[
  #set text(size: 13pt)

  + Sketch the graph of $tan$.
  + Prove that $tan$ is not one-to-one.
  + Select the largest interval containing
    $0$ such that the restriction of $tan$ to
    it is one-to-one. We define $arctan$ as
    the inverse of this restriction. #h(1em)
    Let $x, y in RR$
     $
       arctan y = x thick quad thick <==> thick quad ? ? ?
     $
  + What is the domain of $display(arctan)$?
    What is the range of $display(arctan)$?

     Sketch the graph of $arctan$.
  + Compute
     #grid(
       columns: 2,
       column-gutter: 1em,
       [
         + $display(arctan(tan(1)))$
         + $display(arctan(tan(3)))$
         + $display(arctan(tan(pi/2)))$
       ],
       [
         4. $display(arctan(tan(-6))))$
         + $display(tan(arctan(0)))$
         + $display(tan(arctan(10)))$
       ],
     )
]
