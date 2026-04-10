const hash_crypto = async (value: string): Promise<string> => {
  const buffer = new Uint8Array(32);
  new TextEncoder().encodeInto(value, buffer);
  const hashed = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export default hash_crypto;
