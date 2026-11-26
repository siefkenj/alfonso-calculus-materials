// Slide template for Alfonso Gracia-Saz's MAT137 class questions
// (https://siefkenj.github.io/alfonso-calculus-materials).
//
// It imitates the Beamer template the questions were written for: a 4:3
// slide of 128 mm × 96 mm with 14 pt text, the "Madrid" title bar, and the
// same colours. Each question is one `#question(title: [..])[..]` slide.
// `#show: mat137-slides.with(aspect-ratio: "16-9")` makes them widescreen.
//
// It needs only Touying (https://typst.app/universe/package/touying), so a
// downloaded file compiles on its own. The fonts are New Computer Modern Sans
// and New Computer Modern Sans Math, the Typst counterparts of Beamer's
// default fonts; without them Typst falls back to its built-in fonts.
#let (
  colors: (structure, red, blue, green, violet, verde, rosa, naranja),
  environments: (slide-block, theorem, proof),
  boxes: (boxed, blank, goto-button, drawing),
  slides: (question, mat137-slides),
  // Touying's, for step-by-step slides.
  steps: (pause, meanwhile, only, uncover, alternatives),
) = {
  import "@preview/touying:0.8.0": *

  // --- Colours ---------------------------------------------------------------

  /// Beamer's "structure" blue: title bars, list numbers and bullets.
  let structure = rgb(51, 51, 179)
  // LaTeX's named colours, which differ from Typst's.
  let red = rgb(100%, 0%, 0%)
  let blue = rgb(0%, 0%, 100%)
  let green = rgb(0%, 100%, 0%)
  let violet = rgb(50%, 0%, 50%)
  // Colours defined by the Beamer template.
  let verde = rgb(0%, 70%, 0%)
  let rosa = rgb(100%, 0%, 100%)
  let naranja = rgb(100%, 50%, 10%)

  // --- Boxes -----------------------------------------------------------------

  /// A Beamer `block`: an optional title bar over a tinted body.
  let slide-block(title: none, body) = block(
    width: 100%,
    radius: 3pt,
    clip: true,
    fill: structure.lighten(90%),
    stack(
      if title != none and title != [] {
        block(width: 100%, fill: structure, inset: (x: .5em, y: .35em), text(fill: white, title))
      },
      block(width: 100%, inset: (x: .5em, y: .4em), body),
    ),
  )

  /// A boxed blank or answer, as `\boxed{}` in LaTeX. Usable in text and maths.
  let boxed(body) = box(stroke: .5pt, inset: (x: .25em, y: .25em), outset: (y: .1em), body)

  /// A Beamer `theorem`.
  let theorem(title: none, body) = slide-block(
    title: if title == none [Theorem] else [Theorem (#title)],
    body,
  )

  /// A drawing scaled to `width` (or `height`), as an image would be; given
  /// both, it is stretched to them, as LaTeX's `\includegraphics` does.
  /// An absolute `width` or `height` is best: a relative one needs the space
  /// around it, which a slide with `shrink: true` does not have while it is
  /// being measured.
  let drawing(width: auto, height: auto, body) = {
    let scaled(width, height) = context {
      let natural = measure(body)
      let x = if width != auto { width / natural.width } else if height != auto { height / natural.height } else { 1 }
      let y = if height != auto { height / natural.height } else { x }
      box(scale(x: x * 100%, y: y * 100%, reflow: true, body))
    }
    let relative = (width, height).any(x => type(x) in (ratio, relative))
    if not relative { return scaled(width, height) }
    // A ratio or relative length, against the space available.
    layout(size => {
      let resolve(x, total) = if x == auto { auto } else if type(x) == ratio { x * total } else if (
        type(x) == relative
      ) { x.ratio * total + x.length.to-absolute() } else { x.to-absolute() }
      scaled(resolve(width, size.width), resolve(height, size.height))
    })
  }

  /// A Beamer `proof`.
  let proof(body) = slide-block(title: [Proof.])[#body #h(1fr) #text(fill: structure, $square$)]

  /// Beamer's `\beamergotobutton`: a small rounded link button.
  let goto-button(body) = box(
    fill: structure.lighten(70%),
    radius: 2pt,
    inset: (x: .3em, y: .15em),
    text(size: .7em, sym.triangle.filled.r + " " + body),
  )

  // --- Slides ----------------------------------------------------------------

  /// A blank to fill in: a gap `width` wide, underlined.
  let blank(width: 3em) = box(width: width, stroke: (bottom: .05em), outset: (bottom: .2em))

  /// `body` shrunk to fit the space left on the slide, as a smaller font would
  /// be: laid out wider by as much as it is scaled down, so that it still
  /// fills the slide's width. The scale is the largest that fits, found by
  /// halving the interval between one that fits and one that does not.
  let fit-to-slide(body) = block(width: 100%, height: 1fr, layout(size => {
    let (width, height) = (size.width, size.height)
    // Its height when shrunk by `s`.
    let shrunk(s) = measure(block(width: width / s, body)).height * s
    let natural = shrunk(1)
    if natural <= height { return body }
    // Laid out at the slide's width and scaled down to fit, it fits; wider,
    // it is no taller.
    let (fits, too-big) = (height / natural, 1.0)
    for _ in range(8) {
      let s = (fits + too-big) / 2
      if shrunk(s) <= height { fits = s } else { too-big = s }
    }
    let s = fits
    scale(s * 100%, origin: top + left, reflow: true, block(width: width / s, height: height / s, body))
  }))

  /// One question. `centered` places the body in the middle of the slide (a
  /// Beamer frame without `[t]`); otherwise it starts at the top. `shrink`
  /// scales a question that does not fit down to the slide; it is off by
  /// default because it also stops `#v(1fr)` from spreading the content out.
  let question(title: none, centered: false, shrink: false, body) = touying-slide-wrapper(self => {
    let header = block(
      width: 100%,
      height: 8mm,
      fill: structure,
      inset: (x: 3mm),
      // A title too long for one line is set smaller, as far as 10 pt.
      align(horizon, layout(size => {
        let natural = measure(text(size: 15pt, title)).width
        let fitted = if natural > size.width { calc.max(10pt, 15pt * (size.width / natural) * .98) } else { 15pt }
        text(fill: white, size: fitted, title)
      })),
    )
    self = utils.merge-dicts(self, config-page(header: header))
    // As Beamer does: the slide's free space is shared equally by the
    // question's own `#v(1fr)`s (its `\vfill`s) and the space below it, and
    // above it too if it is centred; not taken by the `#v(1fr)`s alone.
    let body = if centered { v(1fr) + body + v(1fr) } else { body + v(1fr) }
    touying-slide(self: self, if shrink { fit-to-slide(body) } else { body })
  })

  /// The show rule for a document of questions.
  let mat137-slides(
    /// The attribution in each slide's footer.
    copyright: [© Alfonso Gracia-Saz 2020],
    /// The slides' shape: "4-3", as the questions were written for, or
    /// "16-9", for a widescreen; also `--input aspect-ratio=16-9`. A 16:9
    /// slide is as tall as a 4:3 one, only wider, so that what fits on one
    /// fits on the other.
    aspect-ratio: sys.inputs.at("aspect-ratio", default: "4-3"),
    body,
  ) = {
    assert(aspect-ratio in ("4-3", "16-9"), message: "aspect-ratio is \"4-3\" or \"16-9\"")
    show: touying-slides.with(
      config-page(
        width: if aspect-ratio == "16-9" { 96mm * 16 / 9 } else { 128mm },
        height: 96mm,
        // Beamer lets a slide run into its bottom margin, so the margin is
        // small and the footer sits low in it.
        margin: (top: 12mm, bottom: 4mm, x: 5mm),
        // The 8 mm title bar sits at the very top, 4 mm above the body.
        header-ascent: 4mm,
        footer-descent: 1mm,
        footer: align(right, text(size: 7pt, copyright)),
      ),
      // `--input handout=true` shows every slide with all its `#pause`d parts.
      config-common(zero-margin-header: true, handout: sys.inputs.at("handout", default: "false") == "true"),
    )
    set text(font: "New Computer Modern Sans", size: 14pt)
    show math.equation: set text(font: "New Computer Modern Sans Math")
    // Size a line with inline maths by the maths itself, so that a tall
    // `display(..)` does not overprint the line above or below.
    show math.equation.where(block: false): set text(top-edge: "bounds", bottom-edge: "bounds")
    set par(leading: .45em, spacing: .75em)
    // Beamer numbers a nested item with its parent's number, "5.1".
    // Lists are indented from the text, as Beamer's are; a number ends about
    // where a bullet does.
    set enum(
      full: true,
      numbering: (..n) => text(fill: structure, n.pos().map(str).join(".") + if n.pos().len() == 1 { "." }),
      indent: .75em,
      spacing: .55em,
    )
    set list(
      marker: box(baseline: -.2em, circle(radius: .2em, fill: structure, stroke: none)),
      indent: 1em,
      spacing: .55em,
    )
    // A list in a list is set smaller, as Beamer sets it (`\small`, 12 pt of
    // 14), and one in that smaller still.
    show selector.or(list, enum): it => {
      show selector.or(list, enum): set text(size: 12 / 14 * 1em)
      it
    }
    set table(stroke: .5pt)
    body
  }

  (
    colors: (structure, red, blue, green, violet, verde, rosa, naranja),
    environments: (slide-block, theorem, proof),
    boxes: (boxed, blank, goto-button, drawing),
    slides: (question, mat137-slides),
    steps: (pause, meanwhile, only, uncover, alternatives),
  )
}
