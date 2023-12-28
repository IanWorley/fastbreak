/*
  Warnings:

  - Added the required column `made` to the `shot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xPoint` to the `shot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPoint` to the `shot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shot" ADD COLUMN     "made" BOOLEAN NOT NULL,
ADD COLUMN     "xPoint" INTEGER NOT NULL,
ADD COLUMN     "yPoint" INTEGER NOT NULL;
