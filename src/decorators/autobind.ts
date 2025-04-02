namespace App {
  export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const newFn = originalMethod.bind(this);
        return newFn;
      },
    };
    return adjDescriptor;
  }
}
