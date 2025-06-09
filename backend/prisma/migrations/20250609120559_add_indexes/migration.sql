-- CreateIndex
CREATE INDEX "Race_seasonId_idx" ON "Race"("seasonId");

-- CreateIndex
CREATE INDEX "Race_seasonId_date_idx" ON "Race"("seasonId", "date" DESC);

-- CreateIndex
CREATE INDEX "Result_driverId_idx" ON "Result"("driverId");

-- CreateIndex
CREATE INDEX "Season_championId_idx" ON "Season"("championId");
