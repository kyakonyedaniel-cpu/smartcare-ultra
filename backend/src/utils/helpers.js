export const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX'
  }).format(amount / 100);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateInvoiceNumber = (prefix = 'INV') => {
  const date = new Date();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${timestamp}`;
};

export const paginate = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: Math.min(limit, 100) };
};

export const paginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
};