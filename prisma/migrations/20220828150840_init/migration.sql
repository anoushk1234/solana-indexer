-- CreateEnum
CREATE TYPE "CandyError" AS ENUM ('IncorrectOwner', 'Uninitialized', 'MintMismatch', 'IndexGreaterThanLength', 'NumericalOverflowError', 'TooManyCreators', 'UuidMustBeExactly6Length', 'NotEnoughTokens', 'NotEnoughSOL', 'TokenTransferFailed', 'CandyMachineEmpty', 'CandyMachineNotLive', 'HiddenSettingsConfigsDoNotHaveConfigLines', 'CannotChangeNumberOfLines', 'DerivedKeyInvalid', 'PublicKeyMismatch', 'NoWhitelistToken', 'TokenBurnFailed', 'GatewayAppMissing', 'GatewayTokenMissing', 'GatewayTokenExpireTimeInvalid', 'NetworkExpireFeatureMissing', 'CannotFindUsableConfigLine', 'InvalidString', 'SuspiciousTransaction', 'CannotSwitchToHiddenSettings', 'IncorrectSlotHashesPubkey', 'IncorrectCollectionAuthority', 'MismatchedCollectionPDA', 'MismatchedCollectionMint', 'SlotHashesEmpty', 'MetadataAccountMustBeEmpty', 'MissingSetCollectionDuringMint', 'NoChangingCollectionDuringMint', 'CandyCollectionRequiresRetainAuthority');

-- CreateEnum
CREATE TYPE "EndSettingType" AS ENUM ('Date', 'Amount');

-- CreateEnum
CREATE TYPE "WhitelistMintMode" AS ENUM ('BurnEveryTime', 'NeverBurn');

-- CreateTable
CREATE TABLE "CandyMachine" (
    "pubkey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "tokenMint" TEXT,
    "itemsRedeemed" INTEGER NOT NULL,

    CONSTRAINT "CandyMachine_pkey" PRIMARY KEY ("pubkey")
);

-- CreateTable
CREATE TABLE "CandyMachineOnCandyMachineData" (
    "dataId" TEXT NOT NULL,
    "candyMachineId" TEXT NOT NULL,

    CONSTRAINT "CandyMachineOnCandyMachineData_pkey" PRIMARY KEY ("dataId","candyMachineId")
);

-- CreateTable
CREATE TABLE "CandyMachineData" (
    "CandyMachineDataId" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "sellerFeeBasisPoints" INTEGER NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "isMutable" BOOLEAN NOT NULL,
    "retainAuthority" BOOLEAN NOT NULL,
    "goLiveDate" INTEGER,
    "endSettingsId" TEXT NOT NULL,
    "creatorsId" TEXT NOT NULL,
    "hiddenSettingsId" TEXT NOT NULL,
    "whitelistMintSettingsId" TEXT NOT NULL,
    "itemsAvailable" INTEGER NOT NULL,
    "gatekeeperId" TEXT NOT NULL,
    "endSettingsEndSettingsId" TEXT NOT NULL,
    "hiddenSettingsHiddenSettingsId" TEXT NOT NULL,
    "whitelistMintSettingsWhitelistMintSettingsId" TEXT NOT NULL,
    "gatekeeperConfigGatekeeperConfigId" TEXT NOT NULL,

    CONSTRAINT "CandyMachineData_pkey" PRIMARY KEY ("CandyMachineDataId")
);

-- CreateTable
CREATE TABLE "ConfigLine" (
    "ConfigLineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,

    CONSTRAINT "ConfigLine_pkey" PRIMARY KEY ("ConfigLineId")
);

-- CreateTable
CREATE TABLE "EndSettings" (
    "EndSettingsId" TEXT NOT NULL,
    "endSettingType" "EndSettingType" NOT NULL,
    "endSettingTypeId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "EndSettings_pkey" PRIMARY KEY ("EndSettingsId")
);

-- CreateTable
CREATE TABLE "Creator" (
    "CreatorId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "share" INTEGER NOT NULL,
    "candyMachineDataCandyMachineDataId" TEXT,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("CreatorId")
);

-- CreateTable
CREATE TABLE "HiddenSettings" (
    "HiddenSettingsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "hash" INTEGER[],

    CONSTRAINT "HiddenSettings_pkey" PRIMARY KEY ("HiddenSettingsId")
);

-- CreateTable
CREATE TABLE "WhitelistMintSettings" (
    "WhitelistMintSettingsId" TEXT NOT NULL,
    "mode" "WhitelistMintMode" NOT NULL,
    "modeId" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "presale" BOOLEAN NOT NULL,
    "discountPrice" INTEGER,

    CONSTRAINT "WhitelistMintSettings_pkey" PRIMARY KEY ("WhitelistMintSettingsId")
);

-- CreateTable
CREATE TABLE "GatekeeperConfig" (
    "GatekeeperConfigId" TEXT NOT NULL,
    "gatekeeperNetwork" TEXT NOT NULL,
    "expireOnUse" BOOLEAN NOT NULL,

    CONSTRAINT "GatekeeperConfig_pkey" PRIMARY KEY ("GatekeeperConfigId")
);

-- AddForeignKey
ALTER TABLE "CandyMachineOnCandyMachineData" ADD CONSTRAINT "CandyMachineOnCandyMachineData_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "CandyMachineData"("CandyMachineDataId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandyMachineOnCandyMachineData" ADD CONSTRAINT "CandyMachineOnCandyMachineData_candyMachineId_fkey" FOREIGN KEY ("candyMachineId") REFERENCES "CandyMachine"("pubkey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandyMachineData" ADD CONSTRAINT "CandyMachineData_endSettingsEndSettingsId_fkey" FOREIGN KEY ("endSettingsEndSettingsId") REFERENCES "EndSettings"("EndSettingsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandyMachineData" ADD CONSTRAINT "CandyMachineData_hiddenSettingsHiddenSettingsId_fkey" FOREIGN KEY ("hiddenSettingsHiddenSettingsId") REFERENCES "HiddenSettings"("HiddenSettingsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandyMachineData" ADD CONSTRAINT "CandyMachineData_whitelistMintSettingsWhitelistMintSetting_fkey" FOREIGN KEY ("whitelistMintSettingsWhitelistMintSettingsId") REFERENCES "WhitelistMintSettings"("WhitelistMintSettingsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandyMachineData" ADD CONSTRAINT "CandyMachineData_gatekeeperConfigGatekeeperConfigId_fkey" FOREIGN KEY ("gatekeeperConfigGatekeeperConfigId") REFERENCES "GatekeeperConfig"("GatekeeperConfigId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_candyMachineDataCandyMachineDataId_fkey" FOREIGN KEY ("candyMachineDataCandyMachineDataId") REFERENCES "CandyMachineData"("CandyMachineDataId") ON DELETE SET NULL ON UPDATE CASCADE;
