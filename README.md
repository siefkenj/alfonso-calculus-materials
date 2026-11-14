# alfonso-calculus-materials

Calculus Materials from Alfonso Gracia-Saz (MAT137, University of Toronto)

**[See the Materials](https://siefkenj.github.io/alfonso-calculus-materials)**

This is a [Nextra](https://nextra.site/docs)-based site that houses Alfonso Gracia-Saz's calculus materials
that he created for _MAT137: Calculus with Proofs_ at the University of Toronto. The exercises are available
under a Creative Commons By-Attribution Share Alike 4.0 license. That means, provided you cite Alfonso, you
are free to use/modify these exercises in your course.

## About Alfonso

Alfonso Gracia-Saz (1976&ndash;2021) was an [award-winning](https://notes.math.ca/en/article/alphonso-gracia-saz/) math professor
at the University of Toronto. Before his [passing](https://www.utoronto.ca/news/passionate-principled-and-caring-u-t-remembers-math-professor-alfonso-gracia-saz),
Alfonso put countless hours into redesigning [MAT137: Calculus with Proofs](https://artsci.calendar.utoronto.ca/course/mat137y1) at the University of Toronto.

If you find these materials useful, consider donating to the [Alfonso Gracia-Saz Memorial Scholarship](https://engage.utoronto.ca/site/SPageServer?pagename=donate#/fund/1624).

## Development

```sh
npm install
npm run dev     # http://localhost:3000, also reachable from outside a dev container
npm run build   # static site in website/out, with the Pagefind search index
```

`npm run dev` listens on `0.0.0.0`. Next.js only lets pages on `localhost` and
private-network addresses (`10.*`, `172.*`, `192.168.*`, `*.local`) use its dev
resources such as hot reload; to open the dev server under another host name,
list it in `DEV_ORIGINS`, e.g. `DEV_ORIGINS=mybox.example.com npm run dev`.
