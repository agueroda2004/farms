/*
  Warnings:

  - The values [muerta,sacrificada] on the enum `Cerda_condicion` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `acivo` on the `jaula` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jaula_id]` on the table `Cerda` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `cerda` DROP FOREIGN KEY `Cerda_jaula_id_fkey`;

-- DropIndex
DROP INDEX `Cerda_jaula_id_fkey` ON `cerda`;

-- AlterTable
ALTER TABLE `cerda` MODIFY `condicion` ENUM('viva', 'desecho', 'muerte', 'sacrificio', 'aborto', 'lactando', 'gestando', 'destetada') NOT NULL DEFAULT 'viva',
    MODIFY `jaula_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `jaula` DROP COLUMN `acivo`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Cerda_jaula_id_key` ON `Cerda`(`jaula_id`);

-- AddForeignKey
ALTER TABLE `Cerda` ADD CONSTRAINT `Cerda_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
