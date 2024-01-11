export async function serializeObject(obj: Record<string, string | number | boolean>): Promise<string> {
  const str: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p].toString()));
    }
  }
  return str.join("&");
}
