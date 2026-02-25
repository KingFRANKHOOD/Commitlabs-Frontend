// src/app/api/marketplace/route.ts
import { NextRequest } from 'next/server';
import { validatePagination, validateFilters, validateAddress, validateAmount, handleValidationError, ValidationError } from '@/lib/backend/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Validate pagination
    const pagination = validatePagination(page, limit);

    // Validate filters
    const filters = validateFilters({ category, minPrice, maxPrice });

    // Validate price filters if provided
    if (filters.minPrice) {
      validateAmount(filters.minPrice as string | number);
    }
    if (filters.maxPrice) {
      validateAmount(filters.maxPrice as string | number);
    }

    // Mock response
    const listings = [
      { id: '1', title: 'Sample Listing', category: 'impact', price: 50 },
      // ... more
    ];

    return Response.json({
      listings,
      pagination,
      filters,
      total: listings.length
    });
  } catch (error) {
    return handleValidationError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, category, sellerAddress } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      throw new ValidationError('Title is required and must be a string', 'title');
    }
    if (!category || typeof category !== 'string') {
      throw new ValidationError('Category is required and must be a string', 'category');
    }

    // Validate price
    const validatedPrice = validateAmount(price);

    // Validate seller address
    const validatedAddress = validateAddress(sellerAddress);

    // Mock creation
    const newListing = {
      id: Date.now().toString(),
      title,
      description: description || '',
      price: validatedPrice,
      category,
      seller: validatedAddress,
      createdAt: new Date().toISOString()
    };

    return Response.json(newListing, { status: 201 });
  } catch (error) {
    return handleValidationError(error);
  }
}