import Ajv, { JSONSchemaType } from 'ajv';

/**
 * Tiny schema validation helper using Ajv.
 * This is intentionally small to keep framework maintainable.
 */
const ajv = new Ajv({ allErrors: true, strict: false });

export function validateSchema<T>(schema: JSONSchemaType<T>, data: unknown): void {
    const validate = ajv.compile<T>(schema);
    const valid = validate(data);
    if (!valid) {
        // Ajv error objects have rich context; stringify for readable failures.
        const message = ajv.errorsText(validate.errors, { separator: '\n' });
        throw new Error(`Schema validation failed:\n${message}`);
    }
}
