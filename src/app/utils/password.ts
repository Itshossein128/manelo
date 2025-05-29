import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // تعداد دورهای salt برای امنیت بیشتر (12 کافیه)

/**
 * رمز عبور را با استفاده از bcrypt هش می‌کند
 * @param password - رمز عبور plaintext که باید هش بشه
 * @returns رمز عبور هش‌شده
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("خطا در هش کردن رمز عبور: " + error.message);
  }
}

/**
 * رمز عبور plaintext را با رمز عبور هش‌شده مقایسه می‌کند
 * @param password - رمز عبور plaintext که کاربر وارد کرده
 * @param hashedPassword - رمز عبور هش‌شده که توی دیتابیس ذخیره شده
 * @returns true اگه رمز عبور درست باشه، false اگه نادرست باشه
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("خطا در بررسی رمز عبور: " + error.message);
  }
}