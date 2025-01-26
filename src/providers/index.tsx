import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { CrispChat } from './Crisp'
import { TooltipProvider } from '@/components/ui/tooltip'
import ModalProvider from './ModalProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
          <CrispChat />
          <ModalProvider />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
