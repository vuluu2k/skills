# SKILL_GUIDE.md 🌐 [[English](SKILL_GUIDE.md)]

Hướng dẫn đầy đủ về cách tạo và quản lý AI agent skills trong repository này.

---

## Skill là gì?

Một **skill** là một bộ các tệp Markdown dùng để dạy cho một AI agent cách làm việc với một công nghệ hoặc quy trình cụ thể. Agent sẽ đọc các tệp này trước khi viết mã để đảm bảo nó tuân theo các quy ước chính xác.

---

## Các loại Skill

| Loại | Vị trí | Cách quản lý |
|------|----------|---------------------|
| **Manual** | `skills/{tên}/` | Viết thủ công |
| **Generated** | `skills/{tên}/` | AI tạo ra từ `sources/{tên}/docs/` |
| **Synced** | `skills/{tên}/` | Tự động copy từ `vendor/{tên}/skills/` |

Cả ba loại đều tạo ra cấu trúc tệp giống nhau trong thư mục `skills/`.

---

## Cấu trúc thư mục

```
skills/{tên-skill}/
├── SKILL.md                  ← Bắt buộc: tệp chỉ mục chính
├── GENERATION.md             ← Cho generated skills: theo dõi source Git SHA
├── SYNC.md                   ← Cho synced skills: theo dõi vendor Git SHA
└── references/
    ├── core-*.md             ← Các khái niệm cốt lõi (luôn luôn được đọc)
    ├── features-*.md         ← Các tính năng tùy chọn
    ├── advanced-*.md         ← Các chủ đề nâng cao
    └── best-practices-*.md   ← Các pattern và các lỗi thường gặp
```

---

## Định dạng SKILL.md

```markdown
---
name: tên-skill
description: Mô tả một dòng — đây là nội dung AI đọc để quyết định có tải skill hay không.
metadata:
  author: tên-của-bạn
  version: "YYYY.MM.DD"
  source: Viết thủ công / Tạo từ <url>
---

# Tiêu đề Skill

> Tóm tắt và ngữ cảnh trong một dòng (ví dụ: phiên bản nào được hỗ trợ, các ràng buộc chính).

## Cốt lõi (Core)

| Chủ đề | Mô tả | Tham chiếu |
|-------|-------------|-----------|
| Tên chủ đề | Mô tả ngắn | [tên-ref](references/tên-ref.md) |

## Tính năng (Features) (tùy chọn)

| Chủ đề | Mô tả | Tham chiếu |
|-------|-------------|-----------|
| Tên tính năng | Mô tả ngắn | [tên-ref](references/tên-ref.md) |

## Tra cứu nhanh (Quick Reference)

Một ví dụ mã gọn gàng, độc lập hiển thị cách sử dụng phổ biến nhất.
Phần này nên dễ hiểu mà không cần mở bất kỳ tệp tham chiếu nào.
```javascript
// Ví dụ mã ở đây
```
```

---

## Định dạng tệp tham chiếu (Reference File)

```markdown
---
name: tên-tham-chiếu
description: Mô tả ngắn gọn về những gì tham chiếu này đề cập.
---

# Tên chủ đề

Giới thiệu ngắn gọn — khi nào và tại sao nên sử dụng cái này.

## Phần A

Giải thích + ví dụ mã.

## Phần B

Giải thích + ví dụ mã.

<!--
Nguồn tham khảo:
- https://url-tai-lieu-chinh-thuc.com/topic
-->
```

---

## Cách đặt tên tệp tham chiếu

Sử dụng prefix cho các tệp để chỉ định mức độ ưu tiên:

| Prefix | Ý nghĩa |
|--------|---------|
| `core-` | Các kiến thức nền tảng bắt buộc |
| `features-` | Các tính năng tùy chọn, tải khi cần |
| `advanced-` | Các chủ đề phức tạp hoặc hiếm khi sử dụng |
| `best-practices-` | Các pattern, quy ước, các lỗi thường gặp |

Ví dụ: `core-state.md`, `features-transitions.md`, `best-practices-testing.md`

---

## Thêm một manual skill (Loại 1 — Viết thủ công)

1. Tạo thư mục skill:
   ```bash
   mkdir -p skills/{tên-skill}/references
   ```

2. Tạo `skills/{tên-skill}/SKILL.md` — xem định dạng ở trên.

3. Tạo các tệp tham chiếu trong `skills/{tên-skill}/references/`.

4. Đăng ký tên skill trong `meta.ts` mục `manual`:
   ```ts
   export const manual = [
     'vue-options',
     'pinia-options',
     '{tên-skill}', // ← thêm vào đây
   ]
   ```

---

## Thêm một generated skill (Loại 2 — Từ tài liệu OSS)

1. Thêm repo vào `submodules` trong `meta.ts`:
   ```ts
   export const submodules = {
     'tên-skill': 'https://github.com/org/repo',
   }
   ```

2. Clone submodule:
   ```bash
   npm start init
   ```

3. Thêm một tệp hướng dẫn tạo (tùy chọn nhưng nên có):
   ```
   instructions/{tên-skill}.md
   ```
   Dùng tệp này để định nghĩa các quy ước (ví dụ: ưu tiên TypeScript, tránh các pattern nhất định).

4. Đọc tài liệu từ `sources/{tên-skill}/` và viết các tệp skill một cách thủ công vào `skills/{tên-skill}/`.

5. Tạo tệp `skills/{tên-skill}/GENERATION.md`:
   ```markdown
   # Thông tin tạo (Generation Info)

   - **Nguồn:** `sources/{tên-skill}`
   - **Git SHA:** `<run: cd sources/{tên-skill} && git rev-parse HEAD>`
   - **Ngày tạo:** YYYY-MM-DD
   ```

### Cập nhật một Generated Skill

1. Kiểm tra những gì đã thay đổi kể từ lần tạo cuối:
   ```bash
   cd sources/{tên-skill}
   git diff {old-sha}..HEAD -- docs/
   ```

2. Cập nhật các tệp tham chiếu bị ảnh hưởng.

3. Cập nhật `GENERATION.md` với Git SHA mới.

---

## Thêm một synced skill (Loại 3 — Vendor)

1. Thêm vendor vào `meta.ts`:
   ```ts
   export const vendors = {
     'tên-vendor': {
       source: 'https://github.com/org/repo',
       skills: {
         'tên-skill-nguồn': 'tên-skill-đầu-ra',
       }
     }
   }
   ```

2. Clone vendor submodule:
   ```bash
   npm start init
   ```

3. Đồng bộ skill:
   ```bash
   npm start sync
   ```
   Việc này sẽ copy tệp từ `vendor/{tên}/skills/{skill}/` vào `skills/{tên-đầu-ra}/` và tạo `SYNC.md`.

> ⚠️ **Không** chỉnh sửa trực tiếp các tệp synced skill. Các thay đổi phải được thực hiện ở upstream vendor repo.

---

## Thêm một tệp hướng dẫn (Instruction File)

Tạo `instructions/{tên-skill}.md` để định nghĩa các quy ước cho AI-generated hoặc AI-updated skills.

```markdown
- Ưu tiên TypeScript hơn JavaScript.
- Luôn luôn dùng pattern X, không bao giờ dùng pattern Y.
- Đối tượng mục tiêu là người dùng Options API, không đề cập đến Composition API.
```

Tệp này sẽ được đọc cùng với tài liệu nguồn khi yêu cầu AI tạo hoặc cập nhật skill.

---

## Các lệnh CLI

```bash
npm start              # Menu tương tác
npm start init         # Clone các submodules được đăng ký trong meta.ts
npm start sync         # Kéo các bản cập nhật + đồng bộ tất cả vendor skills
npm start check        # Kiểm tra xem submodules có bản cập nhật mới không
npm start cleanup      # Xóa các skills/submodules không có trong meta.ts
```

---

## Hướng dẫn viết

1. **Viết cho agent, không phải cho người** — tránh viết văn dài dòng, ưu tiên các gạch đầu dòng ngắn gọn và các ví dụ mã.
2. **Một khái niệm cho mỗi tệp** — chia nhỏ các chủ đề lớn thành nhiều tệp tham chiếu.
3. **Luôn luôn bao gồm mã** — mỗi phần nên có một ví dụ hoạt động được.
4. **Giải thích các sự đánh đổi** — không chỉ nói *làm thế nào*, mà còn *khi nào* và *tại sao*.
5. **Đảm bảo tính nhất quán** — sử dụng TypeScript trừ khi skill nhắm mục tiêu cụ thể đến JavaScript.
6. **Tránh trùng lặp** — nếu hai tham chiếu trùng nhau nhiều, hãy hợp nhất hoặc liên kết chéo chúng.
