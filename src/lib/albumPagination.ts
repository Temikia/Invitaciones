export const ALBUM_PAGE_SIZE = 50;

export function paginateAlbum<T>(files: T[], requestedPage: number) {
  const pageCount = Math.max(1, Math.ceil(files.length / ALBUM_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  return { page, pageCount, files: files.slice((page - 1) * ALBUM_PAGE_SIZE, page * ALBUM_PAGE_SIZE) };
}
