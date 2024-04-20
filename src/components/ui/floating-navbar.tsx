'use client'

// https://ui.aceternity.com/components/floating-navbar
import { useResizeObserver } from '@react-hookz/web'
import { IconMenu2, IconMoonStars, IconSun } from '@tabler/icons-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import type { TwcComponentProps } from 'react-twc'

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { cn, twx } from '@/lib/utils'

export const FloatingNav = ({ navItems, className }: { navItems: NavItem[]; className?: string }) => {
  const { scrollYProgress } = useScroll()
  const routerPathName = usePathname()
  const { setTheme, theme } = useTheme()
  const isDark = theme === 'dark'

  const isProjectPage = routerPathName === '/project'

  const toggleTheme = useCallback(() => {
    const md = window.matchMedia('(max-width: 768px)').matches

    // @ts-expect-error startViewTransition 可以使用
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(isDark ? 'light' : 'dark')
      return
    }

    // @ts-expect-error startViewTransition 可以使用
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark')
      })
    })

    transition.ready.then(() => {
      const blur = md ? 1 : 3
      const duration = md ? 500 : 700

      document.documentElement.animate(
        {
          clipPath: [`circle(50% at 150% 0%)`, `circle(100% at 50% 50%)`],
          filter: [`blur(${blur}px)`, `blur(0)`],
        },
        {
          duration,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }, [setTheme, isDark])

  const [visible, setVisible] = useState(true)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // 页面无滚动条时则永远显示
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      setVisible(true)
      return
    }
    const direction = current - scrollYProgress.getPrevious()
    if (scrollYProgress.get() < 0.05) {
      setVisible(true)
    } else {
      // 兼容页面加载时 current 为 1
      if (direction <= 0) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
  })
  // 手动调整窗口大小时，如果页面无滚动条则显示
  // 三元表达式解决控制台报错 ReferenceError: window is not defined
  useResizeObserver(typeof window !== 'undefined' ? window.document.body : null, () => {
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      setVisible(true)
    }
  })
  return (
    <>
      {/* Avatar */}
      {visible && routerPathName !== '/' ? (
        <Link href="/">
          <Image
            priority
            className="fixed left-6 top-11 z-[5000] hidden rounded-full border shadow sm:block"
            src="/assets/avatar.png"
            placeholder="blur"
            blurDataURL="/assets/avatar.png"
            alt="avatar"
            width="34"
            height="34"
          />
        </Link>
      ) : null}
      {/* Mobile Menu */}
      {visible ? (
        <Drawer>
          <DrawerTrigger asChild>
            <HeaderButton className="left-6 right-auto sm:hidden" $isProjectPage={isProjectPage}>
              <IconMenu2 className="h-5 w-5" />
            </HeaderButton>
          </DrawerTrigger>
          <DrawerContent className="h-2/3">
            <div className="flex flex-col gap-4 px-10 py-8">
              {navItems.map((navItem: NavItem, idx: number) => (
                <DrawerClose key={`link=${idx}`} asChild>
                  <Link
                    href={navItem.link}
                    className={cn(
                      'flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300',
                      {
                        '!text-zinc-300 hover:!text-zinc-200': isProjectPage,
                        '!text-colorful-500 dark:!text-colorful-400': new RegExp(`^${navItem.link}(/|$)`).test(
                          routerPathName,
                        ),
                      },
                    )}
                  >
                    <span>{navItem.icon}</span>
                    <span>{navItem.name}</span>
                  </Link>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
      {/* PC Menu */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            'fixed inset-x-0 top-10 z-[5000] mx-auto hidden max-w-fit items-center justify-center space-x-4 rounded-full border border-transparent bg-white px-8 py-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  sm:flex dark:border-white/[0.2] dark:bg-black',
            { '!border-zinc-800 !bg-transparent !shadow-2xl backdrop-blur-3xl': isProjectPage },
            className,
          )}
        >
          {navItems.map((navItem: NavItem, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                'relative flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300',
                {
                  '!text-zinc-300 hover:!text-zinc-200': isProjectPage,
                  '!text-colorful-500 dark:!text-colorful-400': new RegExp(`^${navItem.link}(/|$)`).test(
                    routerPathName,
                  ),
                },
              )}
            >
              {/* <span>{navItem.icon}</span> */}
              <span className="text-sm">{navItem.name}</span>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* Toggle Theme */}
      {visible ? (
        <HeaderButton $isProjectPage={isProjectPage} onClick={toggleTheme}>
          {theme === 'dark' ? <IconMoonStars className="h-4 w-4" /> : <IconSun className="h-5 w-5" />}
        </HeaderButton>
      ) : null}
    </>
  )
}

export type NavItem = {
  name: string
  link: string
  icon: React.ReactNode
}

type HeaderButtonProps = TwcComponentProps<'button'> & { $isProjectPage?: boolean }
const HeaderButton = twx.button<HeaderButtonProps>((props) => [
  'fixed right-6 top-10 z-50 rounded-full border bg-white p-2 text-neutral-600 hover:text-neutral-500 dark:border-white/[0.2] dark:bg-black dark:text-neutral-50 dark:hover:text-neutral-300',
  {
    '!border-zinc-800 !bg-transparent !text-zinc-300 !shadow-2xl backdrop-blur-3xl': props.$isProjectPage,
  },
])
