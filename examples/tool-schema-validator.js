/**
 * SIA public showcase example.
 *
 * This is a small illustrative schema validator, not production SIA code.
 */

export function validateToolArguments(schema, args) {
  const errors = [];

  for (const field of schema.required ?? []) {
    if (!(field in args)) {
      errors.push({ field, code: "MISSING_REQUIRED" });
    }
  }

  for (const [field, rule] of Object.entries(schema.properties ?? {})) {
    if (!(field in args)) continue;

    const value = args[field];

    if (rule.type && typeof value !== rule.type) {
      errors.push({
        field,
        code: "INVALID_TYPE",
        expected: rule.type,
        received: typeof value,
      });
    }

    if (Array.isArray(rule.enum) && !rule.enum.includes(value)) {
      errors.push({
        field,
        code: "INVALID_ENUM",
        allowed: rule.enum,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
