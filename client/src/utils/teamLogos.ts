const LOGOS: Record<string, string> = {
  'Real Madrid': '/logos/real-madrid.svg',
  'Barcelona': '/logos/barcelona.svg',
  'Manchester City': '/logos/manchester-city.svg',
  'Arsenal': '/logos/arsenal.svg',
  'Bayern Munich': '/logos/bayern.svg',
  'Paris Saint-Germain': '/logos/psg.svg',
  'Liverpool': '/logos/liverpool.svg',
  'Juventus': '/logos/juventus.svg',
  'Inter Milan': '/logos/inter.svg',
  'Borussia Dortmund': '/logos/dortmund.svg',
}

export function getTeamLogo(teamName: string): string | null {
  return LOGOS[teamName] ?? null
}
