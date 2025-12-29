import bcrypt from "bcrypt";
import { describe, expect, it } from "vitest";
import { verifyPassword } from "../db/userRepository";

describe("unit", () => {
  it("should verify password", async () => {
    const password = "password";
    const hash = bcrypt.hashSync(password, 10);
    const passwordHash =  verifyPassword(password, hash);
    expect(passwordHash).toBeTruthy();
  });
});
