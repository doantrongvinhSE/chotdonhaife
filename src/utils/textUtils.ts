/**
 * Chuyển đổi tiếng Việt có dấu sang không dấu và viết thường
 * @param str - Chuỗi cần chuyển đổi
 * @returns Chuỗi đã chuyển đổi (viết thường, không dấu)
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

