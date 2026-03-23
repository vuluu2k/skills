# My Skills 🌐 [[English](README.md)]

Bộ sưu tập cá nhân các [Agent Skills](https://agentskills.io/home) cho công việc của tôi, tập trung vào các pattern của Vue Options API.

**GitHub:** https://github.com/vuluu2k/skills

## Cài đặt

Cài đặt tất cả skills cùng lúc bằng công cụ agentskills chính thức:

```bash
npx skills add vuluu2k/skills --skill='*'
```

### ⚡ Khuyên dùng: Cài đặt trực tiếp theo Collection

Chúng tôi đã xây dựng một công cụ CLI tùy chỉnh để cho phép cài đặt các bộ skills được định nghĩa sẵn trực tiếp vào dự án của bạn:

```bash
npx @vuluu2k/vskills install
```

Lệnh này sẽ chạy một trình hướng dẫn tương tác để bạn chọn bộ sưu tập (ví dụ: `builderx_spa`) và nó sẽ tự động copy tất cả các skills cần thiết trực tiếp vào thư mục làm việc hiện tại của bạn.

Tìm hiểu thêm về CLI tại [agentskills.io](https://agentskills.io/home).

## Các bộ sưu tập (Collections) hiện có

Khi sử dụng `npx @vuluu2k/vskills install`, bạn có thể chọn từ các bộ sưu tập được tinh chỉnh sau:

| Tên Collection | Các Skills bao gồm |
|----------------|-------------------|
| **`builderx_spa`** | `vue-options`, `pinia-options`, `builderx_spa-api`, `builderx_spa-permission`, `vue-antdv-tailwind` |
| **`vue3-standard`** | `vue`, `pinia`, `vue-best-practices`, `vue-router-best-practices`, `vue-testing-best-practices` |

## Các Skills hiện có

Một số skills chính được viết thủ công bao gồm:

- **`vue`**: Phong cách modern Vue 3 Composition API với script setup.
- **`pinia`**: Quản lý state Pinia sử dụng Composition API.
- **`vue-options`**: Các best practices cho phong cách Vue Options API.
- **`pinia-options`**: Các pattern sạch sẽ cho Pinia options không dùng Composition API.
- **`builderx_spa-api`**: Các quy tắc fetch API chuyên sâu + pattern class-based endpoints ghi đè HTTP chuẩn.
- **`builderx_spa-permission`**: Các quy tắc truy cập dựa trên vai trò sử dụng bitwise permissions.
- **`vue-antdv-tailwind`**: Hướng dẫn kết hợp mượt mà các component Ant Design Vue với Tailwind CSS.

## Tự tạo Skills cho riêng bạn

Fork hoặc clone repository này để tạo bộ sưu tập skill của riêng bạn.

1. Clone repo:
   ```bash
   git clone https://github.com/vuluu2k/skills
   cd skills
   npm install
   ```

2. Cập nhật `meta.ts` với các dự án và nguồn của riêng bạn.

3. Thêm submodules mới:
   ```bash
   npm start init
   ```

4. Đồng bộ vendor skills:
   ```bash
   npm start sync
   ```

5. Yêu cầu AI agent của bạn tạo skills:
   > "Generate skills for `<project>` based on the docs in `sources/<project>/`"

Xem [SKILL_GUIDE.md](SKILL_GUIDE.md) để biết hướng dẫn chi tiết về cách viết skills.

## CLI Quản lý

```bash
npm start              # Menu tương tác
npm start install      # Cài đặt bộ sưu tập skill vào dự án mục tiêu
npm start init         # Clone submodules từ meta.ts
npm start sync         # Kéo cập nhật + đồng bộ vendor skills
npm start check        # Kiểm tra các bản cập nhật có sẵn
npm start cleanup      # Xóa các skills không có trong meta.ts
```

## Cấu trúc thư mục

```
.
├── meta.ts                     # Đăng ký tất cả skills (sources, vendors, manual)
├── SKILL_GUIDE.md              # Hướng dẫn đầy đủ về cách tạo skills
├── scripts/
│   └── cli.ts                  # Công cụ CLI quản lý skills
├── instructions/               # Quy tắc tạo AI cho mỗi skill
├── sources/                    # Các repo OSS được clone để tạo skills
├── vendor/                     # Các repo chứa skills có sẵn để đồng bộ
└── skills/
    ├── vue-options/
    └── pinia-options/
```

## Giấy phép

MIT
