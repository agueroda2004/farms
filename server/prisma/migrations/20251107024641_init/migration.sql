-- CreateTable
CREATE TABLE `Granja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Raza` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jaula` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `acivo` BOOLEAN NOT NULL DEFAULT true,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cerda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `paridad` INTEGER NOT NULL,
    `fecha_ingreso` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `condicion` ENUM('viva', 'desecho', 'muerta', 'sacrificada', 'aborto', 'lactando', 'gestando', 'destetada') NOT NULL DEFAULT 'viva',
    `observacion` VARCHAR(191) NULL,
    `raza_id` INTEGER NOT NULL,
    `jaula_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cerda_Removida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cerda_id` INTEGER NOT NULL,
    `causa` ENUM('desecho', 'muerte', 'sacrificio') NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aborto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `hora` TIME NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `cerda_id` INTEGER NOT NULL,
    `jaula_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berraco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `condicion` ENUM('vivo', 'desecho', 'muerto', 'sacrificado') NOT NULL DEFAULT 'vivo',
    `observacion` VARCHAR(191) NULL,
    `granja_id` INTEGER NOT NULL,
    `raza_id` INTEGER NOT NULL,
    `jaula_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berraco_Removido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `causa` ENUM('desecho', 'muerte', 'sacrificio') NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL,
    `berraco_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `rol` ENUM('administrador', 'operario') NOT NULL DEFAULT 'operario',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `observacion` VARCHAR(191) NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `turno` ENUM('manana', 'tarde', 'noche') NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `cerda_id` INTEGER NOT NULL,
    `berraco_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `jaula_id` INTEGER NOT NULL,
    `operario_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paridera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `total` INTEGER NOT NULL,
    `nacidos_vivos` INTEGER NOT NULL,
    `nacidos_muertos` INTEGER NOT NULL,
    `nacidos_momias` INTEGER NOT NULL,
    `peso` DECIMAL(5, 2) NOT NULL,
    `turno` ENUM('manana', 'tarde', 'noche') NOT NULL,
    `duracion` TIME NOT NULL,
    `hora_inicio` TIME NOT NULL,
    `hora_fin` TIME NOT NULL,
    `manipulada` BOOLEAN NOT NULL DEFAULT false,
    `observacion` VARCHAR(191) NULL,
    `paridera_id` INTEGER NOT NULL,
    `cerda_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `jaula_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parto_Operario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parto_id` INTEGER NOT NULL,
    `operario_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacuna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `imagen` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parto_Vacuna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parto_id` INTEGER NOT NULL,
    `vacuna_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enfermedad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Muertos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `observacion` VARCHAR(191) NULL,
    `peso` DECIMAL(5, 2) NOT NULL,
    `turno` ENUM('manana', 'tarde', 'noche') NOT NULL,
    `hora` TIME NOT NULL,
    `paridera_id` INTEGER NOT NULL,
    `operario_id` INTEGER NOT NULL,
    `enfermedad_id` INTEGER NOT NULL,
    `cerda_id` INTEGER NOT NULL,
    `parto_id` INTEGER NULL,
    `granja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Destete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `peso` DECIMAL(5, 2) NOT NULL,
    `parcial` BOOLEAN NOT NULL DEFAULT false,
    `cerda_id` INTEGER NOT NULL,
    `parto_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `paridera_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adopcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `peso` DECIMAL(5, 2) NOT NULL,
    `cerda_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `paridera_id` INTEGER NOT NULL,
    `parto_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `peso` DECIMAL(5, 2) NOT NULL,
    `cerda_id` INTEGER NOT NULL,
    `granja_id` INTEGER NOT NULL,
    `paridera_id` INTEGER NOT NULL,
    `parto_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Raza` ADD CONSTRAINT `Raza_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jaula` ADD CONSTRAINT `Jaula_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cerda` ADD CONSTRAINT `Cerda_raza_id_fkey` FOREIGN KEY (`raza_id`) REFERENCES `Raza`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cerda` ADD CONSTRAINT `Cerda_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cerda` ADD CONSTRAINT `Cerda_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cerda_Removida` ADD CONSTRAINT `Cerda_Removida_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cerda_Removida` ADD CONSTRAINT `Cerda_Removida_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aborto` ADD CONSTRAINT `Aborto_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aborto` ADD CONSTRAINT `Aborto_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aborto` ADD CONSTRAINT `Aborto_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berraco` ADD CONSTRAINT `Berraco_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berraco` ADD CONSTRAINT `Berraco_raza_id_fkey` FOREIGN KEY (`raza_id`) REFERENCES `Raza`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berraco` ADD CONSTRAINT `Berraco_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berraco_Removido` ADD CONSTRAINT `Berraco_Removido_berraco_id_fkey` FOREIGN KEY (`berraco_id`) REFERENCES `Berraco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berraco_Removido` ADD CONSTRAINT `Berraco_Removido_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Operario` ADD CONSTRAINT `Operario_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monta` ADD CONSTRAINT `Monta_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monta` ADD CONSTRAINT `Monta_berraco_id_fkey` FOREIGN KEY (`berraco_id`) REFERENCES `Berraco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monta` ADD CONSTRAINT `Monta_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monta` ADD CONSTRAINT `Monta_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monta` ADD CONSTRAINT `Monta_operario_id_fkey` FOREIGN KEY (`operario_id`) REFERENCES `Operario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paridera` ADD CONSTRAINT `Paridera_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto` ADD CONSTRAINT `Parto_paridera_id_fkey` FOREIGN KEY (`paridera_id`) REFERENCES `Paridera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto` ADD CONSTRAINT `Parto_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto` ADD CONSTRAINT `Parto_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto` ADD CONSTRAINT `Parto_jaula_id_fkey` FOREIGN KEY (`jaula_id`) REFERENCES `Jaula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Operario` ADD CONSTRAINT `Parto_Operario_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Operario` ADD CONSTRAINT `Parto_Operario_operario_id_fkey` FOREIGN KEY (`operario_id`) REFERENCES `Operario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Operario` ADD CONSTRAINT `Parto_Operario_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacuna` ADD CONSTRAINT `Vacuna_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Vacuna` ADD CONSTRAINT `Parto_Vacuna_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Vacuna` ADD CONSTRAINT `Parto_Vacuna_vacuna_id_fkey` FOREIGN KEY (`vacuna_id`) REFERENCES `Vacuna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parto_Vacuna` ADD CONSTRAINT `Parto_Vacuna_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enfermedad` ADD CONSTRAINT `Enfermedad_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_paridera_id_fkey` FOREIGN KEY (`paridera_id`) REFERENCES `Paridera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_operario_id_fkey` FOREIGN KEY (`operario_id`) REFERENCES `Operario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_enfermedad_id_fkey` FOREIGN KEY (`enfermedad_id`) REFERENCES `Enfermedad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Muertos` ADD CONSTRAINT `Muertos_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destete` ADD CONSTRAINT `Destete_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destete` ADD CONSTRAINT `Destete_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destete` ADD CONSTRAINT `Destete_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destete` ADD CONSTRAINT `Destete_paridera_id_fkey` FOREIGN KEY (`paridera_id`) REFERENCES `Paridera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adopcion` ADD CONSTRAINT `Adopcion_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adopcion` ADD CONSTRAINT `Adopcion_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adopcion` ADD CONSTRAINT `Adopcion_paridera_id_fkey` FOREIGN KEY (`paridera_id`) REFERENCES `Paridera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Adopcion` ADD CONSTRAINT `Adopcion_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_cerda_id_fkey` FOREIGN KEY (`cerda_id`) REFERENCES `Cerda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_granja_id_fkey` FOREIGN KEY (`granja_id`) REFERENCES `Granja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_paridera_id_fkey` FOREIGN KEY (`paridera_id`) REFERENCES `Paridera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_parto_id_fkey` FOREIGN KEY (`parto_id`) REFERENCES `Parto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
