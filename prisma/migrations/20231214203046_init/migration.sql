-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "users_id" TEXT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "jersey" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shot" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "shot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_id" ON "team"("users_id");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shot" ADD CONSTRAINT "shot_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shot" ADD CONSTRAINT "shot_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shot" ADD CONSTRAINT "shot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
