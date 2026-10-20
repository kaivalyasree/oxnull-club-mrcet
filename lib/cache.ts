import { revalidatePath } from 'next/cache';

/**
 * Safely triggers Next.js cache revalidation.
 * Gracefully ignores invariant errors when invoked in test runners or non-request contexts.
 */
export function safeRevalidate(pathStr: string) {
  try {
    revalidatePath(pathStr);
  } catch {
    // In standalone node test runners or build stages, ignore gracefully
  }
}
