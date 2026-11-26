# Typst sources

The questions in [Typst](https://typst.app), alongside the LaTeX ones in
[`../latex-sources`](../latex-sources). The site offers either: the previews,
the source views and the downloads follow the language chosen with the switch
at the foot of the sidebar (or the menu beside any question), and a Typst
question can be edited in the browser with a live preview.

| Path | What it is |
| --- | --- |
| [`template.typ`](template.typ) | The slide template, after the Beamer one (Madrid theme, 128 × 96 mm, 14 pt). Built on [Touying](https://typst.app/universe/package/touying). |
| `questions/unit-NN/qNN.typ` | One `#question(title: [..])[..]` per file; `qNN` is the question's index in `website/public/all-questions.json`. |
| [`function-graph.typ`](function-graph.typ) | What draws the graphs in the questions, with [lilaq](https://typst.app/universe/package/lilaq). |
| [`build.ts`](build.ts) | Bundles the above for the site and renders the previews (see below). |

## Writing a question

A question is a call of `#question` with its title and body:

```typst
#question(title: [Telescopic sum])[
  - Calculate the exact value of
    $ sum_(i=1)^137 [1/i - 1/(i+1)] $
    #emph[Hint:] Write down the first few terms.
]
```

Its options:

- `centered: true` places the body in the middle of the slide, as a Beamer
  frame without `[t]`; otherwise it starts at the top.
- `shrink: true` scales a question that does not fit down to the slide. It is
  off by default because it also stops `#v(1fr)` from spreading the content
  out; use `#v(..)` with a length on a shrunk slide.

The template also defines `slide-block` (a Beamer `block`), `theorem`, `proof`,
`boxed`, `goto-button`, `drawing`, and LaTeX's colours (`red`, `blue`, `verde`,
`rosa`, `naranja`, ...).

The template and [`function-graph.typ`](function-graph.typ) are each one
`#let (question, drawing, ..) = { .. }`, an import written inline: the block
defines everything, and returns only the names a question may use. The live
editor shows them folded. function-graph.typ imports lilaq (`lq`) before its
block, so that the questions can use lilaq's own plots too; a question that
uses any of its names (`lq`, `graph-px`, ..) gets all of function-graph.typ.

## Images

The images are drawn in Typst, in the questions that show them: a question
that shows the same graph as another has its own copy of it. `drawing` scales
a drawing to the width (or height) the question asks for, as an image would
be:

```typst
#align(center)[#drawing(width: 78mm, function-graph(
  // A parabola, a corner at (1, 2), and a vertical tangent at (3, −1).
  graph-fn(x => x * x + 2 * x - 1, to: 1),
  graph-fn(x => 3 - x, from: 1, to: 2),
  graph-fn(x => 2 * calc.sqrt(3 - x) - 1, from: 2, to: 3),
  graph-fn(x => -1 - calc.sqrt(x - 3), from: 3),
  graph-text(2.5, 2.5)[$y = f(x)$],
))]
```

The graphs of functions were drawn with ASCIIsvg; each is redrawn with
[`function-graph`](function-graph.typ), in the same style, from the ASCIIsvg
script kept in its SVG (`website/public/slide-images`), so the formulas are
the originals. G14, G15 and G17 came through PDFs, which lost the script:
their formulas were read off the curves (G17's, a sketch not to scale, by
fitting one to points traced from it). A curve is drawn from a formula, not
from a list of points. G9 and G10, bitmaps, were redrawn with
[CeTZ](https://typst.app/universe/package/cetz).

`function-graph(x: .., y: .., ticks: .., ..)` is the picture of a part of the
plane, with its grid and axes; the plots in it are `graph-fn`, `graph-curve`,
`graph-line`, `graph-dot` and `graph-text`, or any of lilaq's (`lq`). Sizes
are in the pixels of the 550 × 450 originals (`graph-px`). The questions do
not import it: `typst-document.ts` puts it into the document of any question
that uses it (the file the site downloads, and what the editor compiles), so
that the document compiles on its own.

The SVGs and PNGs stay in `website/public/slide-images` for the LaTeX.

Step-by-step slides use Touying's `#pause` and `#only`. The previews and the
editor show each slide with all of its parts (`--input handout=true`).

The slides are 4:3 (128 mm × 96 mm), as the questions were written for.
`#show: mat137-slides.with(aspect-ratio: "16-9")`, or `--input
aspect-ratio=16-9`, makes them widescreen: 170.7 mm × 96 mm, as tall as a 4:3
slide and only wider, so that every question still fits on one slide (Beamer's
own 16:9, 160 mm × 90 mm, is shorter, and two dozen do not). The 4:3/16:9
switch in the site's sidebar does this for its previews, its downloads and
its editor; `build.ts` renders each question's preview of either shape
(`unit-NN-question-N.svg` and `unit-NN-question-N.16x9.svg`), and the LaTeX
the site downloads sets the same size with `\geometry`. Its 16:9 LaTeX
previews (`website/public/slides/unit-NN-question-N.16x9.png`) are made by
`latex-sources/render-previews.ts`, which needs a TeX installation and is run
by hand when the LaTeX changes (they are committed, as the 4:3 ones are).
`build.ts` lists the questions without one, and the site shows their 4:3
preview instead.

## Building

`npm run typst` (run by `npm run dev` and `npm run build`) runs `build.ts`,
which writes

- `website/public/typst/questions.json`: the template, `function-graph` and
  the questions, for the site;
- `website/public/typst/slides/unit-NN-question-N.svg`: each question's
  preview, rendered with the fonts in `website/public/typst/fonts`.

Both are generated (and ignored by Git). A preview is rendered again only when
its source changes. The build fails if a question does not compile, and lists
the questions that run over one slide: give those `shrink: true`.

To compile a question on its own, download it from the site, or put the
template, `function-graph` (if it draws a graph) and the question in one file,
as
`website/components/typst-document.ts` does.

## Where the questions came from

The questions were converted from the LaTeX by
[`../latex-sources/convert-typst.ts`](../latex-sources/convert-typst.ts) and
then corrected by hand: TikZ drawings redrawn with CeTZ, tables, references,
and `shrink: true` on the slides that run over. The converter never overwrites
a question that exists, so it can be run again (`npx vite-node convert-typst.ts`
in `latex-sources`) for a question whose file has been deleted.

The fonts are New Computer Modern Sans and New Computer Modern Sans Math, the
Typst counterparts of Beamer's default fonts, under the GUST font license (see
`website/public/typst/fonts`).
