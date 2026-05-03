// scripts/build-rag.js
// Chạy: node scripts/build-rag.js
// Đọc tất cả file .md trong obsidian-notes/ → tạo src/rag-data.js

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NOTES_DIR = join(__dirname, "../obsidian-notes");
const OUTPUT   = join(__dirname, "../src/rag-data.js");

// Đọc tất cả .md, bỏ file bắt đầu bằng 00- (hướng dẫn)
const files = readdirSync(NOTES_DIR)
  .filter(f => f.endsWith(".md") && !f.startsWith("00-"))
  .sort();

if (files.length === 0) {
  console.error("❌ Không tìm thấy file .md nào trong obsidian-notes/");
  console.error("   Hãy copy các file .md từ Obsidian vào thư mục obsidian-notes/");
  process.exit(1);
}

// Gộp nội dung tất cả file
let combined = "";
for (const file of files) {
  const content = readFileSync(join(NOTES_DIR, file), "utf-8").trim();
  const label   = file.replace(".md","").replace(/^\d+-/,"").toUpperCase();
  combined += `\n\n${"=".repeat(50)}\n[ ${label} ]\n${"=".repeat(50)}\n\n${content}`;
}

const output = `// ⚠️ FILE NÀY ĐƯỢC TẠO TỰ ĐỘNG — ĐỪNG SỬA TAY
// Chạy: node scripts/build-rag.js để cập nhật
// Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}

export const RAG_DATA = \`
Bạn là trợ lý AI đại diện cho chủ nhân của trang web portfolio này — Lê Ngọc Minh Chương.
Trả lời HOÀN TOÀN dựa trên thông tin bên dưới. Nếu không có thông tin, nói thẳng thật.
Trả lời bằng ngôn ngữ người dùng đang dùng (Tiếng Việt hoặc Tiếng Anh).
Gọi chủ nhân là "anh Chương" hoặc "Chương". Ngắn gọn, tối đa 4-5 câu.
Không bịa thông tin ngoài dữ liệu được cung cấp.
${combined}
\`;
`;

writeFileSync(OUTPUT, output, "utf-8");

const chars = combined.length;
const words = combined.split(/\s+/).length;
console.log("✅ Tạo src/rag-data.js thành công!");
console.log(`📄 Đã đọc ${files.length} file: ${files.join(", ")}`);
console.log(`📊 Tổng data: ${chars.toLocaleString()} ký tự / ~${words.toLocaleString()} từ`);
console.log("🚀 Sẵn sàng dùng trong chatbot!");
