/**
 * Qualification type definition.
 * Represents a product review/rating.
 */
export interface Qualification {
  calificacion_id: string;
  producto_id: string;
  usuario_id: string;
  calification: number; // Rating value (1-5)
  comentario: string;
  /**
   * Date of the qualification. Use new Date(fecha) when reading from JSON.
   */
  fecha: Date;
}

/**
 * Response type for average qualification calculation.
 */
export interface QualificationAverageResponse {
  productId: string;
  average: number;
  count: number;
}

// This keeps your codebase type-safe and easy to maintain.
