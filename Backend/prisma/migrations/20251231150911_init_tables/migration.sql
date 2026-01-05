/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "UsuariosPrimaria" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "tipo_cuenta" VARCHAR(10),
    "token_recuperacion" VARCHAR(255),
    "expiracion_token" TIMESTAMP(3),

    CONSTRAINT "UsuariosPrimaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariosSecundaria" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "tipo_cuenta" VARCHAR(10),
    "token_recuperacion" VARCHAR(255),
    "expiracion_token" TIMESTAMP(3),

    CONSTRAINT "UsuariosSecundaria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuariosPrimaria_email_key" ON "UsuariosPrimaria"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuariosSecundaria_email_key" ON "UsuariosSecundaria"("email");
