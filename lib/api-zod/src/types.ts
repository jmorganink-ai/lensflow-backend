/**
 * Hand-written types that mirror the OpenAPI component schemas.
 * These are kept here (rather than generated) because we removed the
 * orval `schemas` option to avoid the duplicate-export collision with
 * the generated Zod barrel.
 */

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}
