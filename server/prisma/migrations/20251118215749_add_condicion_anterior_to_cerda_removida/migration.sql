/*
  Warnings:

  - Added the required column `condicion_anterior` to the `Cerda_Removida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cerda_removida` ADD COLUMN `condicion_anterior` ENUM('viva', 'desecho', 'muerte', 'sacrificio', 'aborto', 'lactando', 'gestando', 'destetada') NOT NULL;
