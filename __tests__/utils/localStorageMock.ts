export const mockStorage = new Map<string, string>();

export const setItem = jest.fn((key, value) => {
  mockStorage.set(key, value);
});

export const removeItem = jest.fn((key) => {
  mockStorage.delete(key);
});

export const getItem = jest.fn((key) => {
  const res = mockStorage.get(key);
  if (res) return res;

  return null;
});
