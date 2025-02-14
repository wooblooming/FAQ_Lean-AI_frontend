export const paginate = (items, page, itemsPerPage) => {
    if (!Array.isArray(items)) {
        throw new Error("items must be an array");
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage,
        paginatedItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};
