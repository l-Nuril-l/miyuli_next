"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { ConnectionContext } from './contexts';
import { getSelf } from './lib/features/auth';
import { addIncomingCall, callDeclined, getAccountCall } from './lib/features/call';
import { newDeleteMessage, newEditMessage } from './lib/features/messenger';

const SignalR = ({ children }) => {
    const dispatch = useAppDispatch();
    const authStore = useAppSelector((s) => s.auth)
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const [connection, setConnection] = useState(null);
    useEffect(() => {
        if (!authStore.session?.access_token) return;
        const retryTimes = [0, 3000, 10000, 60000];
        const connect = new HubConnectionBuilder()
            .withUrl(API_URL + "hub/messenger", { accessTokenFactory: () => authStore.session?.access_token })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: context => {
                    const index = context.previousRetryCount < retryTimes.length ? context.previousRetryCount : retryTimes.length - 1;
                    return retryTimes[index];
                }
            })
            .configureLogging(LogLevel.Information)
            .build()
        setConnection(connect);
    }, [authStore.session?.access_token, API_URL]);

    useEffect(() => {
        if (!connection) return;
        connection.on("Connected", (message) => {
            if (authStore.session && !authStore.account && !authStore.processing) dispatch(getSelf());
        });

        return () => {
            connection.off("Connected");
        }
    }, [connection, authStore.session, authStore.account, authStore.processing, dispatch]);

    useEffect(() => {
        if (!connection) return;
        connection.on("Connected", (message) => {
            console.log(message);
        });
        connection.on("EditMessage", (params) => {
            dispatch(newEditMessage(params))
        });
        connection.on("DeleteMessage", (msgId) => {
            dispatch(newDeleteMessage(msgId))
        });
        connection.on("CallDeclined", (userId, reason) => {
            dispatch(callDeclined(userId, reason))
        });
        connection.on("IncomingCall", (accountId, chatId) => {
            dispatch(addIncomingCall({ accountId, chatId }))
            dispatch(getAccountCall(accountId))
        });
        connection.on("Disconnected", (exception, message) => {
            console.log(exception, message);
        });

        return () => {
            connection.off("Connected");
            connection.off("EditMessage");
            connection.off("DeleteMessage");
            connection.off("CallDeclined");
            connection.off("IncomingCall");
            connection.off("Disconnected");
        }
    }, [connection, dispatch]);


    useEffect(() => {
        if (!connection) return;
        if (!authStore.session) return

        async function connect() {
            await connection.start();
        }

        if (connection.state === "Disconnected") {
            connect()
        }

        var connectInterval;

        connectInterval = setInterval(() => {
            if (connection.state === "Connected") clearInterval(connectInterval);
            if (connection.state === "Disconnected") connect()
        }, 30_000);

        return () => {
            clearInterval(connectInterval)
            connection.stop()
        }

    }, [connection, authStore.session])

    return (
        <ConnectionContext.Provider value={connection} >
            {children}
        </ConnectionContext.Provider>
    );
}

export default SignalR;
