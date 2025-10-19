-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('LIGHT', 'DARK', 'AUTO');

-- CreateEnum
CREATE TYPE "StoolColor" AS ENUM ('BROWN', 'LIGHT_BROWN', 'DARK_BROWN', 'GREEN', 'YELLOW', 'BLACK', 'RED', 'PALE');

-- CreateEnum
CREATE TYPE "StoolConsistency" AS ENUM ('HARD', 'FIRM', 'SOFT', 'LIQUID', 'WATERY');

-- CreateEnum
CREATE TYPE "StoolSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "SymptomType" AS ENUM ('BLOATING', 'CRAMPS', 'GAS', 'NAUSEA', 'PAIN', 'HEARTBURN', 'FATIGUE', 'OTHER');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('DAIRY', 'GLUTEN', 'MEAT', 'POULTRY', 'FISH', 'SEAFOOD', 'VEGETABLE', 'FRUIT', 'GRAIN', 'LEGUME', 'NUT', 'SEED', 'SPICE', 'BEVERAGE', 'PROCESSED', 'OTHER');

-- CreateEnum
CREATE TYPE "FiberContent" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'NONE');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('CAUSES_DIARRHEA', 'CAUSES_CONSTIPATION', 'CAUSES_BLOATING', 'CAUSES_PAIN', 'CAUSES_GAS');

-- CreateEnum
CREATE TYPE "PatternType" AS ENUM ('TEMPORAL', 'DIETARY', 'LIFESTYLE', 'CORRELATION');

-- CreateEnum
CREATE TYPE "PrivacyLevel" AS ENUM ('PRIVATE', 'INVITE_ONLY', 'PUBLIC');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('CONSISTENCY', 'LOGGING', 'HEALTH', 'SOCIAL', 'MILESTONE');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('STREAK', 'COUNT', 'TRIGGER_IDENTIFICATION', 'GROUP_JOIN', 'REPORT_GENERATION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "theme_preference" "ThemePreference" NOT NULL DEFAULT 'AUTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stool_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bristol_type" INTEGER NOT NULL,
    "color" "StoolColor",
    "consistency" "StoolConsistency",
    "size" "StoolSize",
    "urgency" INTEGER,
    "completeness" INTEGER,
    "blood_present" BOOLEAN NOT NULL DEFAULT false,
    "mucus_present" BOOLEAN NOT NULL DEFAULT false,
    "undigested_food" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "photo_analyzed" BOOLEAN NOT NULL DEFAULT false,
    "ai_confidence_score" DOUBLE PRECISION,
    "ai_analysis_notes" TEXT,
    "logged_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stool_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "meal_type" "MealType" NOT NULL,
    "description" TEXT,
    "photo_url" TEXT,
    "ingredients" JSONB,
    "estimated_fiber_g" DOUBLE PRECISION,
    "estimated_water_ml" DOUBLE PRECISION,
    "logged_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "symptom_type" "SymptomType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "duration_minutes" INTEGER,
    "notes" TEXT,
    "logged_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symptom_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lifestyle_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sleep_hours" DOUBLE PRECISION,
    "sleep_quality" INTEGER,
    "exercise_minutes" INTEGER,
    "exercise_type" TEXT,
    "stress_level" INTEGER,
    "water_intake_ml" INTEGER,
    "medications" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lifestyle_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "common_allergen" BOOLEAN NOT NULL DEFAULT false,
    "fiber_content" "FiberContent" NOT NULL,
    "is_probiotic" BOOLEAN NOT NULL DEFAULT false,
    "is_fermented" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triggers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "trigger_type" "TriggerType" NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "last_detected_at" TIMESTAMP(3) NOT NULL,
    "identified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pattern_type" "PatternType" NOT NULL,
    "description" TEXT NOT NULL,
    "example_dates" JSONB NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_acknowledged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "privacy_level" "PrivacyLevel" NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "requirement_type" "RequirementType" NOT NULL,
    "requirement_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "user_id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("user_id","achievement_id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date_range_start" DATE NOT NULL,
    "date_range_end" DATE NOT NULL,
    "pdf_url" TEXT,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "stool_logs_user_id_logged_at_idx" ON "stool_logs"("user_id", "logged_at" DESC);

-- CreateIndex
CREATE INDEX "meal_logs_user_id_logged_at_idx" ON "meal_logs"("user_id", "logged_at" DESC);

-- CreateIndex
CREATE INDEX "symptom_logs_user_id_logged_at_idx" ON "symptom_logs"("user_id", "logged_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "lifestyle_logs_user_id_date_key" ON "lifestyle_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "triggers_user_id_confidence_score_idx" ON "triggers"("user_id", "confidence_score" DESC);

-- CreateIndex
CREATE INDEX "patterns_user_id_detected_at_idx" ON "patterns"("user_id", "detected_at" DESC);

-- AddForeignKey
ALTER TABLE "stool_logs" ADD CONSTRAINT "stool_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom_logs" ADD CONSTRAINT "symptom_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lifestyle_logs" ADD CONSTRAINT "lifestyle_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patterns" ADD CONSTRAINT "patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

