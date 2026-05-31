import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import Navbar from '~/components/Navbar'
import { api } from '~/trpc/react'
import DrawerPlayer from '~/components/game/PlayerSelectDrawer'

export const Route = createFileRoute('/team/$id/game/$gameId/stats')({
  component: StatsPage,
})

function StatsPage() {
  const { id, gameId } = Route.useParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [playerToSwap, setPlayerToSwap] = useState('')

  const {
    data: game,
    isLoading: isGameLoading,
    isError: isGameError,
  } = api.game.grabGame.useQuery({
    teamId: id,
    gameId: gameId,
  })

  const {
    data: players,
    isError: playerIsError,
    isLoading: playerIsLoading,
  } = api.team.grabPlayers.useQuery(id)

  const {
    data: shots,
    isError: shotsIsError,
    isLoading: shotIsLoading,
  } = api.game.grabPlayersShotsFromGame.useQuery({
    gameId: gameId,
    teamId: id,
    quarter: undefined,
  })

  if (isGameLoading || shotIsLoading || playerIsLoading) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        <p className="text-center">Loading...</p>
      </main>
    )
  }

  if (isGameError || playerIsError || shotsIsError) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        {isGameError ? (
          <p className="text-center">Error loading game</p>
        ) : playerIsError ? (
          <p className="text-center">Error loading players</p>
        ) : (
          <p className="text-center">Error loading shots</p>
        )}
      </main>
    )
  }

  if (players!.length === 0) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
          {game?.name ?? 'Unknown Game'}
        </h1>
        <p className="text-center">No players found</p>
      </main>
    )
  }

  return (
    <main className="">
      <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
      <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
        {game?.name ?? 'Unknown Game'}
      </h1>
      {playerToSwap !== '' ? (
        <h3 className="p-2 text-center text-2xl">
          {players?.find((player) => player.id === playerToSwap)?.name}
        </h3>
      ) : (
        <h3 className="p-2 text-center text-2xl">Select a Player</h3>
      )}

      <StatsInfo gameId={gameId} shots={shots ?? []} playerId={playerToSwap} />
      <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen)
          }}
          className="fixed bottom-5"
        >
          Select Player
        </Button>
      </div>

      <DrawerPlayer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        setPlayerToSwap={setPlayerToSwap}
        playerToSwap={playerToSwap}
        players={players ?? []}
      />
    </main>
  )
}

interface IPropsStatsInfo {
  shots: any[]
  playerId: string
  gameId: string
}

function StatsInfo(props: IPropsStatsInfo) {
  const { shots, playerId, gameId } = props

  const stats = shots
    .filter((shot: any) => shot.player_Id === playerId && shot.game_Id === gameId)
    .reduce(
      (acc, shot: any) => {
        if (shot.made) {
          if (shot.isFreeThrow) {
            acc.freeThrowMade++
          }
          if (!shot.isFreeThrow && shot.points === 2) {
            acc.twoPointMade++
          }
          if (shot.points === 3) {
            acc.threePointMade++
          }
        }

        if (shot.isFreeThrow) {
          acc.freeThrowTotal++
        }
        if (!shot.isFreeThrow && shot.points === 2) {
          acc.twoPointTotal++
        }
        if (shot.points === 3) {
          acc.threePointTotal++
        }

        return acc
      },
      {
        freeThrowMade: 0,
        twoPointMade: 0,
        threePointMade: 0,
        freeThrowTotal: 0,
        twoPointTotal: 0,
        threePointTotal: 0,
      },
    )

  const {
    freeThrowMade,
    twoPointMade,
    threePointMade,
    freeThrowTotal,
    twoPointTotal,
    threePointTotal,
  } = stats

  const totalMade = freeThrowMade + twoPointMade + threePointMade
  const totalShots = freeThrowTotal + twoPointTotal + threePointTotal

  return (
    <div className="grid grid-cols-3 grid-rows-2 items-center gap-2 bg-primary-foreground p-5 lg:mx-60">
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Free Throws</h4>
        <p className="text-center">{freeThrowMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">2PTS</h4>
        <p className="text-center">{twoPointMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">3PTS</h4>
        <p className="text-center">{threePointMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Total Shots</h4>
        <p className="text-center">{totalShots}</p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Missed Shots</h4>
        <p className="text-center">{totalShots - totalMade}</p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Shot %</h4>
        <p className="text-center">{(totalMade / totalShots) * 100 || 0}%</p>
      </div>
    </div>
  )
}
