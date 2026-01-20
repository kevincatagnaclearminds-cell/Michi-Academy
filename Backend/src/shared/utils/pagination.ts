export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationHelper {
  static parseParams(query: any): { skip: number; take: number; page: number; limit: number } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10)); // Máximo 100 items por página
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
  }

  static createMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static async paginate<T>(
    model: any,
    query: any,
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<T>> {
    const { skip, take, page, limit } = this.parseParams(paginationParams);

    const [data, total] = await Promise.all([
      model.findMany({
        ...query,
        skip,
        take,
      }),
      model.count({
        where: query.where,
      }),
    ]);

    return {
      data,
      meta: this.createMeta(page, limit, total),
    };
  }
}
