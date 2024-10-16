export function paramsToRecord(
  params: URLSearchParams
): Record<string, string> {
  const record: Record<string, string> = {};

  params.forEach((value, key) => {
    record[key] = value;
  });

  return record;
}
