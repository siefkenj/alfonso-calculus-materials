// Graphs of functions, in the style of the ASCIIsvg pictures they replace.
#import "@preview/lilaq:0.6.0" as lq

#let (
  graphs: (
    function-graph, graph-fn, graph-curve, graph-line, graph-dot, graph-text,
  ),
  style: (graph-px, graph-blue, graph-red, graph-green),
) = {
  /// A pixel of the 550 × 450 ASCIIsvg pictures: sizes are given in these.
  let graph-px = 0.2mm
  let graph-blue = rgb(0, 0, 255)
  let graph-red = rgb(255, 0, 0)
  let graph-green = rgb("#acf2ac")

  /// The part `x` × `y` of the plane, with its grid and axes, and the plots
  /// (`graph-*` below, or lilaq's).
  let function-graph(
    x: (-4.3, 4.3),
    y: (-3.3, 3.3),
    ticks: (1, 1),
    grid: auto,
    labels: true,
    axes: true,
    ..plots,
  ) = {
    let px = graph-px
    let grid = if grid == auto { ticks } else { grid }
    let labels = if type(labels) == bool { (labels, labels) } else { labels }
    let multiples(lim, d) = {
      range(calc.ceil(lim.at(0) / d - 1e-9), calc.floor(lim.at(1) / d + 1e-9) + 1).map(i => i * d).filter(t => (
        calc.abs(t) > 1e-9
      ))
    }
    let format(t) = if t < 0 [−#calc.abs(t)] else [#t]
    let axis(lim, d, labels) = {
      let ticks = multiples(lim, d)
      (
        position: 0,
        hidden: not axes,
        ticks: if ticks == () { none } else { ticks.map(t => (t, if labels { format(t) })) },
        subticks: none,
        tick-args: (inset: 4 * px, outset: 4 * px),
      )
    }
    let grid-lines = if grid == none { () } else {
      let stroke = .5 * px + luma(170)
      let (xs, ys) = (multiples(x, grid.at(0)), multiples(y, grid.at(1)))
      if xs != () { (lq.vlines(..xs, stroke: stroke, z-index: 1),) } else { () }
      if ys != () { (lq.hlines(..ys, stroke: stroke, z-index: 1),) } else { () }
    }
    set text(size: 25 * px)
    show: lq.set-tick(pad: .4em, stroke: 1 * px + black)
    show: lq.set-spine(tip: none, toe: none, stroke: 1 * px + black)
    box(width: 550 * px, height: 450 * px, clip: true, lq.diagram(
      width: 550 * px,
      height: 450 * px,
      bounds: "data-area",
      xlim: x,
      ylim: y,
      xaxis: axis(x, ticks.at(0), labels.at(0)),
      yaxis: axis(y, ticks.at(1), labels.at(1)),
      grid: none,
      legend: none,
      ..grid-lines,
      ..plots.pos().map(p => if type(p) == function { p(x, y) } else { p }),
    ))
  }

  /// The graph of `f`, from `from` to `to`.
  let graph-fn(f, from: auto, to: auto, samples: 200, color: graph-blue, width: 2, dash: none) = (x, y) => {
    let xs = lq.linspace(if from == auto { x.at(0) } else { from }, if to == auto { x.at(1) } else { to }, num: samples)
    // Points far off the picture (near an asymptote) are moved to just beyond it.
    let (low, high) = (y.at(0) - (y.at(1) - y.at(0)), y.at(1) + (y.at(1) - y.at(0)))
    let ys = xs.map(t => calc.clamp(f(t), low, high))
    lq.plot(xs, ys, mark: none, stroke: (paint: color, thickness: width * graph-px, dash: dash))
  }

  /// The curve `t ↦ (fx(t), fy(t))`.
  let graph-curve(fx, fy, from, to, samples: 400, color: graph-blue, width: 2) = {
    let ts = lq.linspace(from, to, num: samples)
    lq.plot(ts.map(fx), ts.map(fy), mark: none, stroke: width * graph-px + color)
  }

  let graph-line(a, b, color: graph-blue, width: 2, dash: none) = lq.plot(
    (a.at(0), b.at(0)),
    (a.at(1), b.at(1)),
    mark: none,
    stroke: (paint: color, thickness: width * graph-px, dash: dash),
  )

  let graph-dot(x, y, open: false, color: graph-blue, radius: 6) = lq.place(x, y, circle(
    radius: radius * graph-px,
    fill: if open { white } else { color },
    stroke: 2 * graph-px + color,
  ))

  let graph-text(x, y, size: 32, color: black, align: center + horizon, body) = lq.place(
    x,
    y,
    align: align,
    text(size: size * graph-px, fill: color, body),
  )

  (
    graphs: (
      function-graph, graph-fn, graph-curve, graph-line, graph-dot, graph-text,
    ),
    style: (graph-px, graph-blue, graph-red, graph-green),
  )
}
