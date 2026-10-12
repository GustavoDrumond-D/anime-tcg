import { createContext, useContext } from 'react'
import type { CardDef, Universe } from '../engine/cards'
import type { BuyResult, Profile } from '../engine/economy'

export interface ProfileApi {
  profile: Profile
  buy: (u: Universe, count: number) => BuyResult
  sell: (card: CardDef, qty: number) => void
  sellExtras: () => number
  /** Só em desenvolvimento (import.meta.env.DEV). */
  dev: { grant: (fragments: number) => void; grantCard: (card: CardDef) => void; reset: () => void }
}

export const ProfileContext = createContext<ProfileApi | null>(null)

export function useProfile(): ProfileApi {
  const api = useContext(ProfileContext)
  if (!api) throw new Error('useProfile fora do ProfileProvider')
  return api
}
