import { useState, type ReactNode } from 'react'
import { CATALOG } from '../data/cards'
import { ECONOMY, START_FRAGMENTS, START_FREE_PACKS } from '../data/economy'
import { PACKS } from '../data/packs'
import * as eco from '../engine/economy'
import { load, save } from '../storage/local'
import { ProfileContext, type ProfileApi } from './profileContext'

const KEY = 'profile'

/** Estado do jogador (Fragmentos, inventário, garantia), salvo localmente a cada mudança. */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() =>
    load(KEY, eco.newProfile(START_FRAGMENTS, START_FREE_PACKS)),
  )
  const commit = (p: eco.Profile) => {
    setProfile(p)
    save(KEY, p)
  }
  const api: ProfileApi = {
    profile,
    buy: (u, count) => {
      const r = eco.buyPacks(profile, PACKS[u], count, CATALOG, Math.random, ECONOMY)
      if (r.ok) commit(r.profile)
      return r
    },
    sell: (card, qty) => {
      const p = eco.sellCard(profile, card, qty, ECONOMY)
      if (p) commit(p)
    },
    sellExtras: () => {
      const r = eco.sellExtras(profile, CATALOG, ECONOMY)
      commit(r.profile)
      return r.gained
    },
    dev: {
      grant: (n) => commit({ ...profile, fragments: profile.fragments + n }),
      reset: () => commit(eco.newProfile(START_FRAGMENTS, START_FREE_PACKS)),
    },
  }
  return <ProfileContext.Provider value={api}>{children}</ProfileContext.Provider>
}
