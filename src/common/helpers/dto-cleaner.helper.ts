export  function cleanDtoHelper(dto: Record<string, any>) {
  const cleaned: Record<string, any> = {};
  for (const key in dto) {
    const value = dto[key];
    if (value !== null && value !== "" && value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}