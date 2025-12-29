import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { initDatabase } from "../db/database.js";
import { app } from "../server.js";

describe("POST /api/auth/register - Регистрация пользователя", () => {
  let server;

  beforeAll(async () => {
    // Инициализируем тестовую базу данных в памяти
    await initDatabase(":memory:");

    // Запускаем сервер
    server = app.listen(3002);

    // Ждем запуска сервера
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  test("Успешная регистрация нового пользователя", async () => {
    // Генерируем уникальное имя пользователя для теста
    const uniqueUsername = `testuser_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const testUser = {
      username: uniqueUsername,
      password: "securePassword123",
    };

    // Выполняем запрос на регистрацию
    const response = await request(server)
      .post("/api/auth/register")
      .send(testUser)
      .set("X-Forwarded-For", "192.168.1.100")
      .expect("Content-Type", /json/)
      .expect(201);

    // Проверяем ответ
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Пользователь успешно зарегистрирован");
    expect(response.body.user.username).toBe(testUser.username);
    expect(response.body.user.id).toBeDefined();
    expect(typeof response.body.user.id).toBe("number" || "string");

    // Проверяем, что пользователь действительно создан
    // Можно попробовать залогиниться с этими учетными данными
    const loginResponse = await request(server)
      .post("/api/auth/login")
      .send(testUser)
      .set("X-Forwarded-For", "192.168.1.100")
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.user.username).toBe(testUser.username);
  });
});
