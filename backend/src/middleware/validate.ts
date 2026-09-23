import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

type Source = "body" | "params" | "query";

// Augment Express Request to hold validated data
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validatedBody?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const messages = result.error.issues
        .map((e) => `${e.path.join(".") || source}: ${e.message}`)
        .join("; ");
      next(new AppError(`Validation failed: ${messages}`, 400, "VALIDATION_ERROR"));
      return;
    }
    // Store parsed (coerced + defaulted) data on request
    if (source === "body") req.validatedBody = result.data as Record<string, unknown>;
    else if (source === "params") req.validatedParams = result.data as Record<string, unknown>;
    else if (source === "query") req.validatedQuery = result.data as Record<string, unknown>;
    next();
  };
}
