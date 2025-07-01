/*
  Warnings:

  - A unique constraint covering the columns `[concertId,userId]` on the table `AuditLogConcert` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuditLogConcert_concertId_userId_key" ON "AuditLogConcert"("concertId", "userId");
