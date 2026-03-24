<div align="center">
  <h1>🚀 devskill: Nâng tầm AI Agent của bạn</h1>
  <p><strong>Kho tri thức lập trình chuyên sâu cho Cursor, GitHub Copilot, & AgentSkills</strong></p>
  <p>
    <a href="README.md">🇺🇸 Read in English (Đọc Tiếng Anh)</a> •
    <a href="https://agentskills.io/home" target="_blank">Về AgentSkills</a>
  </p>
</div>

## 🤔 Vấn đề

Bạn mệt mỏi vì phải liên tục nhắc nhở trợ lý AI về các tiêu chuẩn code riêng của team mình? Bạn chán ngấy việc nhận được các Vue component cơ bản khi bạn cần tích hợp chặt chẽ Ant Design + Tailwind, hoặc các REST endpoint mẫu khi team bạn sử dụng class-based API và Action Fallbacks?

## 💡 Giải pháp

**`devskill`** là một bộ sưu tập các "Agent Skills" được tuyển chọn kỹ lưỡng, giàu ngữ cảnh, được thiết kế để định hướng AI theo đúng stack phát triển của bạn. Ngừng viết prompt thủ công, bắt đầu xây dựng sản phẩm.

Bằng cách cung cấp cho AI các tài liệu `SKILL.md` chuyên dụng, bạn sẽ **loại bỏ tình trạng AI "ảo tưởng" (hallucination)** và thực thi nghiêm ngặt kiến trúc dự án của mình.

## ✨ Tại sao bạn cần công cụ này

- 🧠 **Onboarding dự án tức thì:** Một lệnh duy nhất sẽ đưa toàn bộ ngữ cảnh cần thiết vào thư mục `.agents/skills` của bạn.
- 🎯 **Độ chính xác tuyệt đối:** Từ các pattern niche của Vue Options API đến các quy tắc Elixir Phoenix Ecto.Multi, nhận code chính xác theo ý bạn.
- ⚡ **Thiết lập không tốn sức:** CLI tương tác, thiết kế đẹp mắt giúp việc quản lý skills trở nên dễ dàng.

---

## 📦 Cài đặt & Bắt đầu nhanh

Quên việc copy thủ công đi. Chúng tôi đã xây dựng một CLI tương tác thanh lịch để đưa kiến thức trực tiếp vào repo của bạn.

```bash
# Mở menu tương tác chính
npx devskill

# Tuỳ chọn 1: Cài đặt toàn bộ một nhóm (collection) skills
npx devskill install

# Tuỳ chọn 2: Thêm các skills đơn lẻ (chọn bằng phím Space)
npx devskill add
```

> **Mẹo:** Bạn cũng có thể cài đặt mọi skill trên toàn hệ thống bằng công cụ chính thức:  
> `npx skills add vuluu2k/skills --skill='*'`

---

## 📚 Bộ sưu tập tuyển chọn (Collections)

Chọn chính xác "nâng cấp não bộ" mà AI của bạn cần.

| Bộ sưu tập | Lĩnh vực trọng tâm | Các Skills bao gồm |
|------------|------------|-----------------|
| 🏗️ **`builderx_spa`** | Frontend BuilderX chuyên dụng | `vue-options`, `pinia-options`, `builderx_spa-api`, `builderx_spa-permission`, `vue-antdv-tailwind` |
| ⚙️ **`builderx_api`** | Backend Phoenix Elixir | `builderx_api-schemas`, `builderx_api-controllers`, `builderx_api-contexts` |
| 🌟 **`vue3-standard`** | Làm chủ Vue 3 thuần túy | `vue`, `pinia`, `vue-best-practices`, `vue-router-best-practices`, `vue-testing-best-practices` |

## 🛠️ Chi tiết: Các Skills hiện có

Một số skill được viết tay tỉ mỉ nằm trong các bộ sưu tập:

### Hệ sinh thái Frontend & Vue
- **`vue` / `vue-best-practices`**: Phong cách Modern Vue 3 Composition API với script setup, kỹ thuật animation và rendering nâng cao.
- **`pinia`**: Quản lý state sử dụng Composition API.
- **`vue-options` / `pinia-options`**: Các best practices chuẩn mực cho các tổ chức vẫn đang tận dụng sức mạnh của Vue Options API.
- **`vue-router-best-practices`**: Tránh lỗi vòng lặp điều hướng vô tận và các lỗi vòng đời.
- **`vue-testing-best-practices`**: Blackbox testing, thiết lập Vitest và E2E Playwright.

### Các Pattern Kiến trúc Nâng cao
- **`builderx_spa-api`**: Các quy tắc fetch API chuyên sâu + pattern class-based endpoint thay thế HTTP tiêu chuẩn.
- **`builderx_spa-permission`**: Quy tắc phân quyền dựa trên Role sử dụng bitwise permissions.
- **`vue-antdv-tailwind`**: Hướng dẫn chuẩn để kết hợp mượt mà Ant Design Vue với Tailwind CSS.

### Backend (Elixir / Phoenix)
- **`builderx_api-schemas`**: Các quy ước Ecto schema bao gồm custom json serializers.
- **`builderx_api-controllers`**: Action fallback và cấu trúc tuple phản hồi chuẩn cho Phoenix controller.
- **`builderx_api-contexts`**: Sử dụng Ecto.Multi và Outbox pattern cho các transaction phức tạp nhiều bước.

---

## ⚙️ Tự tạo & Quản lý Skills của riêng bạn

Bạn muốn xây dựng kho tri thức AI của riêng mình? Fork hoặc clone repo này để bắt đầu tạo bộ sưu tập skill tùy chỉnh cho team.

1. **Clone repo:**
   ```bash
   git clone https://github.com/vuluu2k/skills
   cd skills
   npm install
   ```

2. **Cập nhật `meta.ts`** với các dự án và nguồn skill của bạn.

3. **Sử dụng CLI mạnh mẽ** để quản lý:
   ```bash
   npm start              # Mở menu tương tác
   npm start install      # Cài đặt bộ sưu tập skill vào dự án đích
   npm start init         # Clone các submodule được theo dõi từ meta.ts
   npm start sync         # Cập nhật + đồng bộ vendor skills
   npm start check        # Kiểm tra cập nhật từ remote
   npm start cleanup      # Xóa các skill cũ không có trong meta.ts
   ```

4. **Yêu cầu AI generate skills:**
   > "Generate skills cho `<project>` dựa trên tài liệu trong `sources/<project>/`"

Xem [SKILL_GUIDE.md](SKILL_GUIDE.md) để biết hướng dẫn chi tiết về cách viết một AI skill hoàn hảo.

---
<div align="center">
  <p>Xây dựng với ❤️ bởi vuluu2k. License: MIT</p>
</div>
