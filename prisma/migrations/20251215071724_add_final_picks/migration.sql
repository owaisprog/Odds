-- AlterTable
ALTER TABLE "Eventprediction" ADD COLUMN     "overUnderFinalPick" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "playerPropFinalPick" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "spreadFinalPick" TEXT NOT NULL DEFAULT '';
