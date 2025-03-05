export const generateUniqueNumber = () => {
    return Date.now() + Math.floor(Math.random() * 1000000);
};