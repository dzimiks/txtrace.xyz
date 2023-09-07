const generateShortAddress = (address: string, leftOffset = 10, rightOffset = 4) => {
  if (!address) {
    return null;
  }

  return `${address.slice(0, leftOffset)}...${address.slice(address.length - rightOffset)}`;
};

export { generateShortAddress };
