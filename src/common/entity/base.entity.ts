import { instanceToPlain } from 'class-transformer';

let iocContainer: { get<T>(someClass: any): T };

export function useContainer(ioc: { get(someClass: any): any }): void {
  iocContainer = ioc;
}

const providersCache = new Map<any, any>();

export function useProviderOrFail<T>(provider: any): T {
  if (!iocContainer) {
    throw new Error('Container not initialized');
  }

  const cacheKey =
    provider.constructor === Symbol ? provider.toString() : provider.name;

  if (providersCache.has(cacheKey)) {
    return providersCache.get(cacheKey) as T;
  }

  const p = iocContainer.get<{ new (...args: any[]): T }>(provider);

  providersCache.set(cacheKey, p);

  return p as T;
}

export function trackChanges<T>(e: BaseEntity<any>): T {
  return new Proxy(e, {
    set(target: any, prop: any, value: any) {
      target[prop] = value;
      target._changedProps.push(prop);
      return true;
    },
  }) as T;
}
export abstract class BaseEntity<T> {
  protected _operation: 'create' | 'update' = 'create';
  private _changedProps: (keyof T)[] = [];

  _toPersist(operation: 'create'): T;
  _toPersist(operation: 'update'): Partial<Omit<T, 'id'>>;
  _toPersist(operation: 'create' | 'update'): T | Partial<Omit<T, 'id'>> {
    const plain = instanceToPlain(this, { excludeExtraneousValues: true });
    if (operation === 'create') {
      return plain as T;
    } else {
      const persist: Partial<T> = {};

      for (const prop of this._changedProps) {
        if (prop === 'id') continue;
        persist[prop] = plain[prop as string];
      }
      return persist;
    }
  }
}
