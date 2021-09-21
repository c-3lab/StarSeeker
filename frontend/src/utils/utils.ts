export const getUniqueId = () => {
  return (
    new Date().getTime().toString(16) +
    Math.floor(Math.random() * 1000000).toString(16)
  );
};
