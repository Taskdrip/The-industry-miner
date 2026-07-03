export * from "./generated/api";
export * from "./generated/types";
// The following names are ambiguous between generated/api (zod schema) and
// generated/types (interface) because they are used directly as request
// bodies. Explicit re-exports resolve the star-export ambiguity in favor of
// the zod schema, which is also usable as a type via z.infer.
export { CreateLessonBody, CreateOrderBody, UpdateLessonBody } from "./generated/api";
