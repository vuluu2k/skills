#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "📦 Chuẩn bị Publish package devskill lên NPM..."

# 1. Kiểm tra trạng thái đăng nhập NPM
if ! npm whoami > /dev/null 2>&1; then
  echo "⚠️ Bạn chưa đăng nhập NPM. Hệ thống sẽ tự động bật giao diện đăng nhập (Trình duyệt) ngay sau đây..."
  npm login
  # Check lại xem đăng nhập thành công chưa
  if ! npm whoami > /dev/null 2>&1; then
    echo "❌ LỖI: Đăng nhập thất bại hoặc bị huỷ lệnh. Vui lòng thử lại sau."
    exit 1
  fi
fi

NPM_USER=$(npm whoami)
echo "✅ Đã đăng nhập NPM với tài khoản: $NPM_USER"

if [[ "$NPM_USER" != "vuluu2k" ]]; then
  echo "⚠️ CẢNH BÁO: Package trong package.json đang được đặt tên là devskill."
  echo "Hãy chắc chắn rằng tài khoản '$NPM_USER' của bạn có quyền publish package 'devskill' trên npmjs.com."
  echo ""
fi

# 2. Tuỳ chọn tăng Version (Semantic Versioning)
echo "Bạn có muốn tự động tăng phiên bản (Version Bump) không?"
echo "Nhập patch (chữa lỗi), minor (tính năng nhỏ), major (thay đổi lớn), hoặc nhấn Enter để bỏ qua:"
read -p "> " BUMP_TYPE

if [ -n "$BUMP_TYPE" ]; then
  npm version "$BUMP_TYPE"
  echo "✅ Đã tăng phiên bản thành công!"
fi

# 3. Đẩy code lên GitHub (nếu rảnh tay)
read -p "Đẩy toàn bộ thay đổi và Tag version mới lên GitHub luôn không? (y/N): " PUSH_GIT
if [[ "$PUSH_GIT" =~ ^[Yy]$ ]]; then
  git push
  git push --tags
  echo "✅ Đã đẩy code an toàn lên GitHub."
fi

# 4. Tiến hành Publish
echo "🚀 Đang tiến hành Publish lên NPM Registry..."
npm publish --access public

echo "🎉 CHÚC MỪNG! Đã publish thành công!"
