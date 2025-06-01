type Handler<T> = (data: T) => void;

export class Emitter<T> {
  handlers = new Map<Set<string>, Handler<T>>();

  on(tags: string[], handler: Handler<T>) {
    this.handlers.set(new Set(tags), handler);
  }

  emit(tags: string[], data: T) {
    for (const [key, handler] of this.handlers) {
      // Handler's key must contain all tags being emitted.
      if (key.isSupersetOf(new Set(tags))) {
        handler(data);
      }
    }
  }
}
