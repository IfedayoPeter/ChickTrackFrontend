export const sortByDate = (data, order = "asc") => {
  return data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
