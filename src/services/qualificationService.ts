import { QualificationAverageResponse } from '@/types/qualification';

/**
 * Fetches the average qualification for a product by its ID.
 * Returns null if not found or on error.
 */
export async function getProductQualificationAverage(
  productId: string
): Promise<QualificationAverageResponse | null> {
  try {
    const res = await fetch(`/api/qualifications/${productId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Best practices:
 * - Returns null on error for easy handling
 * - Uses async/await for clarity
 * - Typed response for safety
 */
