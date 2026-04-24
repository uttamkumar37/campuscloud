import type { PropsWithChildren, ReactNode } from 'react'
import { Component } from 'react'

import { Button } from './Button'
import { Card } from './Card'

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <Card className="max-w-lg text-center">
              <h1 className="text-2xl font-semibold text-slate-950">Something went wrong</h1>
              <p className="mt-2 text-sm text-slate-500">
                The application hit an unexpected error. Refresh to recover the session.
              </p>
              <div className="mt-5 flex justify-center">
                <Button onClick={() => window.location.reload()}>Reload App</Button>
              </div>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}
