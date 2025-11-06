-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_updatedAt_idx" ON "users"("updatedAt");

-- CreateIndex
CREATE INDEX "users_userType_createdAt_idx" ON "users"("userType", "createdAt");

-- CreateIndex
CREATE INDEX "users_email_userType_idx" ON "users"("email", "userType");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");
