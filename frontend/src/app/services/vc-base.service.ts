export class VcListControl {
    public selected: number;
    mark(id: number) {
        this.selected = id;
    }
    isMarked(id: number) {
        return this.selected === id;
    }
    trackByID(index: number, item: any) {
      return item.ID;
    }
}
