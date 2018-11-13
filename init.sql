-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema dbe5jaho52
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dbe5jaho52
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dbe5jaho52` DEFAULT CHARACTER SET utf8 ;
USE `dbe5jaho52` ;

-- -----------------------------------------------------
-- Table `dbe5jaho52`.`henkilo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbe5jaho52`.`henkilo` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dbe5jaho52`.`laite_kategoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbe5jaho52`.`laite_kategoria` (
  `id` INT NOT NULL,
  `nimi` VARCHAR(45) NULL,
  `tyyppi` VARCHAR(45) NULL,
  `kuvaus` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dbe5jaho52`.`laite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbe5jaho52`.`laite` (
  `id` INT NOT NULL,
  `laite_kategoria_id` INT NOT NULL,
  `sarjanumero` VARCHAR(45) NULL,
  `kunto` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_laite_laite_kategoria1_idx` (`laite_kategoria_id` ASC),
  CONSTRAINT `fk_laite_laite_kategoria1`
    FOREIGN KEY (`laite_kategoria_id`)
    REFERENCES `dbe5jaho52`.`laite_kategoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dbe5jaho52`.`lainaus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbe5jaho52`.`lainaus` (
  `id` INT NOT NULL,
  `laite_id` INT NOT NULL,
  `lainaaja_id` INT NOT NULL,
  `luovutus_id` INT NOT NULL,
  `vastaanotto_id` INT NOT NULL,
  `lainaus_pvm` DATETIME NULL,
  `era_pvm` DATETIME NULL,
  `palautus_pvm` DATETIME NULL,
  `kunto_palautettaessa` VARCHAR(45) NULL,
  PRIMARY KEY (`id`, `laite_id`, `lainaaja_id`, `luovutus_id`, `vastaanotto_id`),
  INDEX `fk_lainaus_laite1_idx` (`laite_id` ASC),
  INDEX `fk_lainaus_henkilo1_idx` (`lainaaja_id` ASC),
  INDEX `fk_lainaus_henkilo2_idx` (`luovutus_id` ASC),
  INDEX `fk_lainaus_henkilo3_idx` (`vastaanotto_id` ASC),
  CONSTRAINT `fk_lainaus_laite1`
    FOREIGN KEY (`laite_id`)
    REFERENCES `dbe5jaho52`.`laite` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lainaus_henkilo1`
    FOREIGN KEY (`lainaaja_id`)
    REFERENCES `dbe5jaho52`.`henkilo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lainaus_henkilo2`
    FOREIGN KEY (`luovutus_id`)
    REFERENCES `dbe5jaho52`.`henkilo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lainaus_henkilo3`
    FOREIGN KEY (`vastaanotto_id`)
    REFERENCES `dbe5jaho52`.`henkilo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dbe5jaho52`.`vastuu_henkilo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbe5jaho52`.`vastuu_henkilo` (
  `henkilo_id` INT NOT NULL,
  `laite_kategoria_id` INT NOT NULL,
  PRIMARY KEY (`henkilo_id`, `laite_kategoria_id`),
  INDEX `fk_vastuu_henkilo_laite_kategoria1_idx` (`laite_kategoria_id` ASC),
  CONSTRAINT `fk_vastuu_henkilo_henkilo`
    FOREIGN KEY (`henkilo_id`)
    REFERENCES `dbe5jaho52`.`henkilo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vastuu_henkilo_laite_kategoria1`
    FOREIGN KEY (`laite_kategoria_id`)
    REFERENCES `dbe5jaho52`.`laite_kategoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

