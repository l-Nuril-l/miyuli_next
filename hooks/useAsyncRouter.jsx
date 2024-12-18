'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'

const createRouteObserver = () => {
    let observer = null

    const setObserver = (callback) => {
        observer = callback
    }

    const notify = () => {
        if (observer) {
            observer()
        }
    }

    return { setObserver, notify }
}

const routeObserver = createRouteObserver()

export const useAsyncRouter = () => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const asyncPush = async (path) => {
        return new Promise((resolve) => {
            startTransition(() => {
                router.push(path)
            })

            routeObserver.setObserver(() => {
                resolve()
            })
        })
    }

    const asyncRefresh = async () => {
        return new Promise((resolve) => {
            startTransition(() => {
                router.refresh()
            })

            routeObserver.setObserver(() => {
                resolve()
            })
        })
    }

    useEffect(() => {
        if (!isPending) {
            routeObserver.notify()
        }
    }, [isPending])

    return { asyncPush, asyncRefresh }
}