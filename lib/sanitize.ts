export function sanitizeFileName(name: string): string {
  return name
    .replace(/[åÅ]/g, 'a')
    .replace(/[äÄ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    .replace(/[éÉèÈêÊëË]/g, 'e')
    .replace(/[üÜ]/g, 'u')
    .replace(/[ñÑ]/g, 'n')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}
