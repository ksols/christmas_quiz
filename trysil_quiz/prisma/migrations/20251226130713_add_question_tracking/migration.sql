-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "questionNumber" INTEGER;

-- CreateTable
CREATE TABLE "GameState" (
    "id" SERIAL NOT NULL,
    "currentQuestionNumber" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);
