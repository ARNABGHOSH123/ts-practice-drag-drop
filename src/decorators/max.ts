import { validatorConfig } from "../util/validation.js";

export function Max(value: number) {
  return function (target: any, propertyKey: string) {
    validatorConfig[target.constructor.name] = {
      ...validatorConfig[target.constructor.name],
      [propertyKey]: [
        ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
        `max-${value}`,
      ],
    };
  };
}
