import { Pastry } from '@prisma/client';

export type OrderBy = Extract<keyof Pastry, 'price' | 'createdAt'> | 'popularity';

export type Order = 'asc' | 'desc';