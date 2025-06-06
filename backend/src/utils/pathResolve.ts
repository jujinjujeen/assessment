import { fileURLToPath } from 'url';
import path from 'path';

export const pathResolve = (metaUrl: string, relativePath: string): string => {
  const __dirname = path.dirname(fileURLToPath(metaUrl));
  return path.resolve(__dirname, relativePath);
};