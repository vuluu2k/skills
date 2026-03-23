<div align="center">
  <h1>🚀 vskills: Nâng Cấp Sức Mạnh Cho AI Agent Của Bạn</h1>
  <p><strong>Chuyên Môn Lập Trình Dành Riêng Cho Cursor, GitHub Copilot, & AgentSkills</strong></p>
  <p>
    <a href="README.md">🇺🇸 Read in English</a> •
    <a href="https://agentskills.io/home" target="_blank">Về AgentSkills</a>
  </p>
</div>

## 🤔 Vấn Đề Của Bạn

Bạn đã chán ngấy việc phải liên tục nhắc nhở trợ lý AI của mình về **tiêu chuẩn code riêng** của team? Bạn bực mình khi AI sinh ra các component Vue chung chung trong khi bạn đang cần tích hợp chặt chẽ giữa Ant Design và Tailwind? Hoặc viết các HTTP REST Endpoint tẻ nhạt thay vì tận dụng kiến trúc Class-based API và Action Fallback của hệ thống bạn?

## 💡 Giải Pháp: `vskills`

**`vskills`** là một bộ sưu tập "Agent Skills" được tinh chỉnh tỉ mỉ, giàu ngữ cảnh, thiết kế riêng để **đồng bộ hóa suy nghĩ của AI** với kiến trúc mã nguồn của bạn. Đừng tốn thời gian "prompting" nữa, hãy bắt tay vào xây dựng sản phẩm.

Bằng cách nạp vào cho AI tài liệu `SKILL.md` chuyên sâu, bạn sẽ **loại bỏ các "ảo giác" (hallucinations) của AI** và đảm bảo toàn bộ mã nguồn được sinh ra đều tuân thủ nguyên tắc hệ thống một cách nghiêm ngặt.

## ✨ Tại Sao Bạn Cần `vskills`?

- 🧠 **Onboarding Dự Án Ngay Lập Tức:** Chỉ với một dòng lệnh, toàn bộ kiến thức và luật lệ của project sẽ được đưa thẳng vào thư mục `.agents/skills` của bạn.
- 🎯 **Chính Xác Tuyệt Đối:** Từ những pattern ngách của Vue Options API đến quy tắc quản lý Database Transaction bằng Ecto.Multi của Phoenix, bạn sẽ nhận được đúng đoạn code mình cần.
- ⚡ **Cài Đặt Không Ma Sát:** CLI tương tác mượt mà giúp bạn lựa chọn và tải các skill nhanh chóng với thiết kế giao diện Terminal tuyệt đẹp.

---

## 📦 Cài Đặt & Bắt Đầu Nhanh

Hãy quên việc copy-paste thủ công đi! Chúng tôi đã xây dựng một CLI xịn xò để tiêm thẳng hệ thống kỹ năng vào thư mục dự án của bạn:

```bash
npx @vuluu2k/vskills install
```

> **Mẹo Nâng Cao:** Nếu bạn muốn tải toàn bộ mọi skills thông qua công cụ gốc của AgentSkills:  
> `npx skills add vuluu2k/skills --skill='*'`

---

## 📚 Các Bộ Sưu Tập (Collections)

Chỉ cần chọn "bộ não" phù hợp cho AI của bạn:

| Tên Collection | Lĩnh Vực | Các Skills Bao Gồm |
|----------------|----------|--------------------|
| 🏗️ **`builderx_spa`** | Kiến Trúc Frontend Đặc Thù | `vue-options`, `pinia-options`, `builderx_spa-api`, `builderx_spa-permission`, `vue-antdv-tailwind` |
| ⚙️ **`builderx_api`** | Phoenix Elixir Backend | `builderx_api-schemas`, `builderx_api-controllers`, `builderx_api-contexts` |
| 🌟 **`vue3-standard`** | Chuẩn Mực Vue 3 Mới | `vue`, `pinia`, `vue-best-practices`, `vue-router-best-practices`, `vue-testing-best-practices` |

## 🛠️ Phân Tích Chuyên Sâu Các Skills Hiện Có

Một số skills giá trị nhất được chúng tôi đúc kết qua các dự án thực tế:

### Hệ Sinh Thái Vue
- **`vue` / `vue-best-practices`**: Các best-practice mới nhất cho Vue 3 Composition API với script setup, kỹ thuật animation và render nâng cao.
- **`pinia`**: Quản lý State tối ưu bằng Composition API.
- **`vue-options` / `pinia-options`**: Dành cho các hệ thống vẫn tận dụng sức mạnh to lớn của Vue Options API (Pattern để viết code Options mượt mà nhất).
- **`vue-router-best-practices`**: Xử lý triệt để lỗi vòng lặp vô hạn và kẹt lifecycle khi điều hướng.
- **`vue-testing-best-practices`**: Blackbox testing, cấu hình Vitest và chạy E2E bằng Playwright.

### Kiến Trúc Lõi Nâng Cao
- **`builderx_spa-api`**: Bộ luật Fetch API cực sâu + Pattern Class-based endpoints sinh ra để thay thế/ghi đè các thiết kế HTTP Service rườm rà.
- **`builderx_spa-permission`**: Cấu hình phân quyền thông minh dựa trên kỹ thuật tính toán nhị phân (bitwise roles).
- **`vue-antdv-tailwind`**: Bí kíp "Trộn" (Mix) Ant Design Vue với bộ class tiện ích của Tailwind CSS một cách sạch sẽ và không gây xung đột UI.

### Bậc Thầy Backend (Elixir / Phoenix)
- **`builderx_api-schemas`**: Quy chuẩn Ecto schema cốt lõi tích hợp custom JSON serializers.
- **`builderx_api-controllers`**: Tiêu chuẩn sử dụng Action Fallback và tuple response chung thống nhất.
- **`builderx_api-contexts`**: Giải quyết bài toán đa quy trình (Multi-step transactions) bằng Ecto.Multi song hành với Outbox pattern.

---

## ⚙️ Tự Tạo Quỹ Kỹ Năng Cho Doanh Nghiệp Của Bạn

Bạn muốn tự tay xây dựng kho tàng kiến thức AI nội bộ? Fork hoặc clone kho dữ liệu này:

1. **Tải về Repo:**
   ```bash
   git clone https://github.com/vuluu2k/skills
   cd skills
   npm install
   ```

2. **Sửa đổi file `meta.ts`** để khai báo các dự án thực tế bạn đang cắm submodules học hỏi.

3. **Dùng CLI Mạnh Mẽ Của Chúng Tôi** để thao tác vạn vật:
   ```bash
   npm start              # Hiện Menu tương tác đỉnh cao
   npm start install      # Cài skills vào dự án đang làm việc
   npm start init         # Tự động Clone toàn bộ Tracked Submodules từ meta.ts
   npm start sync         # Đồng bộ (Pull & Deploy) vendor skills tự động
   npm start check        # Cập nhật xem remote có commit nào mới để sync
   npm start cleanup      # Tối ưu: xoá sạch những logic dư thừa không định nghĩa
   ```

4. **Khai thác AI Agent:**
   > "Generate skills for `<project>` based on the docs in `sources/<project>/`"

Sách Trắng hướng dẫn: Xem ngay [SKILL_GUIDE.vn.md](SKILL_GUIDE.vn.md) để biết cách huấn luyện bằng AI Skills chuẩn nhất.

---
<div align="center">
  <p>Được xây dựng bằng cả đam mê ❤️ bởi vuluu2k. License: MIT</p>
</div>
