/**
 * Map slide page listed in question to a guess of its actual question number.
 *
 * The following algorithm is used:
 *  1. It is assumed that each page number in corresponds to one question.
 *  2. The in page numbers are sorted.
 *  3. The question number for a given page is its index in the sorted list.
 */
export class PageMapper {
    initList: number[] = [];
    initToActual: Record<number, number> = {};

    addPage(page: number | string) {
        if (typeof page === "string") {
            page = parseInt(page, 10);
        }
        if (!(page >= 0)) {
            // Do nothing if we don't have a valid page number
            return;
        }
        this.initList.push(page);
    }
    getQuestionNumber(page: number | string) {
        if (typeof page === "string") {
            page = parseInt(page, 10);
        }
        if (Object.keys(this.initToActual).length < this.initList.length) {
            // Do the sort, etc.
            const sorted = this.initList.slice().sort((a, b) => a - b);
            for (let i = 0; i < sorted.length; i++) {
                this.initToActual[sorted[i]] = i;
            }
        }
        return this.initToActual[page];
    }
}
