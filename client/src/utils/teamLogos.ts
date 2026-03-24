const cache: Record<string, string | null> = {}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function fetchLogosForTeams(
  teamNames: string[],
  onUpdate: (name: string, logo: string | null) => void
) {
  const unique = [...new Set(teamNames)]

  for (const name of unique) {
    if (name in cache) {
      onUpdate(name, cache[name])
      continue
    }

    try {
      const res = await fetch(
        `/sportsdb/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`
      )
      const data = await res.json()
      const logo = data?.teams?.[0]?.strTeamBadge ?? null
      cache[name] = logo
      onUpdate(name, logo)
    } catch {
      cache[name] = null
      onUpdate(name, null)
    }

    await delay(300)
  }
}
