import { cn } from '@/lib/utils'

export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full  items-center justify-center bg-white bg-grid-black/[0.2] dark:bg-background dark:bg-grid-white/[0.2]',
        className,
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background"></div>
      {/* <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p> */}
    </div>
  )
}

export function GridSmallBackground({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center  bg-background bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2]',
        className,
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center  bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_90%,black)]"></div> */}
      {/* <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p> */}
      {children}
    </div>
  )
}

export function DotBackground() {
  return (
    <div className="relative flex h-[50rem] w-full  items-center justify-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p>
    </div>
  )
}
