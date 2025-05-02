export const sortByDate = (data, order = "desc") => {
  // Create a new array before sorting to avoid mutation
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};