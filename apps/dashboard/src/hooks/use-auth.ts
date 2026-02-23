'use client'

import { useUser, useOrganization } from '@clerk/nextjs'

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { organization } = useOrganization()

  return {
    user,
    organization,
    isLoaded,
    isSignedIn,
    fullName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
    email: user?.emailAddresses[0]?.emailAddress ?? '',
    avatarUrl: user?.imageUrl,
    businessId: user?.publicMetadata?.businessId as string | undefined,
  }
}
