/*
  Warnings:

  - A unique constraint covering the columns `[raceName,seasonId]` on the table `Race` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Race_raceName_seasonId_key" ON "Race"("raceName", "seasonId");
