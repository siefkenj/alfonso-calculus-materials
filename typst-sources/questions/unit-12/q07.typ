#question(title: [What is wrong with this computation?])[
  $
    integral_(-1)^1 1/x thin d x thick &= thick lim_(epsilon -> 0^+) [integral_(-1)^(-epsilon) 1/x thin d x thick + thick integral_epsilon^1 1/x thin d x thin] \ thick &= thick lim_(epsilon -> 0^+) [lr(#hide[$display(1/1)$] ln abs(x) |)_(-1)^(-epsilon) thick + lr(#hide[$display(1/1)$] ln abs(x) |)_epsilon^1 thick] \ thick &= thick lim_(epsilon -> 0^+) [thin ln abs(- epsilon) - ln abs(epsilon) thin] #hide[$display(integral)$] \ thick &= thick lim_(epsilon -> 0^+) [thin 0 thin] thick = thick 0 #hide[$display(integral)$]
  $
]
