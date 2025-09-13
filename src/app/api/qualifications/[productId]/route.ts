import { NextResponse } from 'next/server';
import { Qualification } from '@/types/qualification';
import fs from 'fs/promises';
import path from 'path';
const jwt = require('jsonwebtoken');

// JWT secret and config
const JWT_SECRET =
  '@y*&0a%K%7P0t@uQ^38HN$y4Z^PK#0zE7dem700Bbf&pC6HF$aU^ARkE@u$nn';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // Token valid for 30 days

/**
 * GET /api/qualifications/[productId]
 * Returns average and list of qualifications for a product.
 * Supports sorting by date or calification via query params.
 * Example: ?sort=date&order=desc
 */
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  // Get sort param from URL
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort'); // 'date' or 'calification'
  const order = searchParams.get('order') || 'desc'; // 'asc' or 'desc'

  // Path to the fake DB
  const dbPath = path.join(process.cwd(), 'db.json');
  let qualifications: Qualification[] = [];

  try {
    // Read and parse the db.json file
    const dbRaw = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbRaw);
    // Convert 'fecha' from string to Date object for each qualification
    qualifications = (db.calificaciones || []).map((q: any) => ({
      ...q,
      fecha: new Date(q.fecha),
    }));
  } catch (error) {
    // Database read error
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Filter qualifications for the given product
  let productQualifications = qualifications.filter(
    (q) => q.producto_id === productId
  );
  if (productQualifications.length === 0) {
    // No qualifications found for this product
    return NextResponse.json({ productId, average: null, count: 0 });
  }

  // Sort qualifications if requested by query params
  if (sort === 'date') {
    productQualifications = productQualifications.sort((a, b) =>
      order === 'asc'
        ? a.fecha.getTime() - b.fecha.getTime()
        : b.fecha.getTime() - a.fecha.getTime()
    );
  } else if (sort === 'calification') {
    productQualifications = productQualifications.sort((a, b) =>
      order === 'asc'
        ? a.calification - b.calification
        : b.calification - a.calification
    );
  }

  // Calculate the average qualification value
  const sum = productQualifications.reduce((acc, q) => acc + q.calification, 0);
  const average = sum / productQualifications.length;

  // Return result with average and sorted qualifications
  return NextResponse.json({
    productId,
    average,
    count: productQualifications.length,
    qualifications: productQualifications,
  });
}

/**
 * DELETE /api/qualifications/[productId]
 * Deletes a qualification if requester is owner or admin.
 * JWT must be sent in the Authorization header as 'Bearer <token>'.
 * Returns 401 if token is missing/invalid, 403 if not allowed, 404 if not found.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // 1. Validate JWT token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET, { maxAge: TOKEN_MAX_AGE });
  } catch {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // 2. Load qualifications from db.json file
  const dbPath = path.join(process.cwd(), 'db.json');
  let db;
  try {
    const dbRaw = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(dbRaw);
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  const qualifications = db.calificaciones || [];
  const qualification = qualifications.find(
    (q: any) => q.calificacion_id === params.productId
  );
  if (!qualification) {
    return NextResponse.json(
      { error: 'Qualification not found' },
      { status: 404 }
    );
  }

  // 3. Check if user is owner or admin
  if (payload.id !== qualification.usuario_id && payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 4. Remove qualification from array and update db.json
  const updatedQualifications = qualifications.filter(
    (q: any) => q.calificacion_id !== params.productId
  );
  db.calificaciones = updatedQualifications;
  try {
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete qualification' },
      { status: 500 }
    );
  }

  // 5. Return success response
  return NextResponse.json({ success: true }, { status: 200 });
}

/**
 * Best practices used:
 * - Type safety with TypeScript interfaces
 * - Error handling for file operations
 * - Clean separation of concerns (reading, filtering, calculating)
 * - Returns count for frontend display
 * - Uses Next.js API route conventions
 */
