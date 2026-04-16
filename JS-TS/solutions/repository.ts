export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    this.items.push(entity);
    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    const indexToChange = this.items.findIndex((t) => t.id === id);
    this.items[indexToChange] = { ... this.items[indexToChange], ...patch };
    return this.items[indexToChange];
  }

  remove(id: number): void {
    this.items = this.items.filter((t) => t.id !== id);
  }

  findById(id: number): T | undefined {
    return this.items.find(t => t.id == id);
  }

  findAll(): T[] {
    return this.items;
  }
}
