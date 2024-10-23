"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

import { newMessage } from '@/lib/features/messenger';
import { useContext, useEffect, useRef } from 'react';
import { ConnectionContext } from '../contexts';


const NotificationService = () => {
    const connection = useContext(ConnectionContext);
    const isCanPlayNotification = useRef(true);
    const audioRef = useRef(null);
    useEffect(() => {
        audioRef.current = new Audio('/audios/notification.mp3');
    }, []);
    const dispatch = useAppDispatch();
    const openedChatId = useAppSelector((s) => s.messenger.chat?.id);
    const myId = useAppSelector((s) => s.auth.session?.id);
    const router = useRouter()

    const isMobileDevice = useAppSelector(s => s.miyuli.isMobileDevice)

    useEffect(() => {
        if (navigator.serviceWorker && !navigator.serviceWorker.controller) navigator.serviceWorker.register('sw.js');
    }, []);

    useEffect(() => {
        const playNotificationSound = () => {
            if (isCanPlayNotification.current) {
                audioRef.current.play();
                isCanPlayNotification.current = false;
                setTimeout(() => {
                    isCanPlayNotification.current = true;
                }, 3000);
            }
        };

        const checkNotificationPermission = () => {
            return new Promise((resolve, reject) => {
                if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                        resolve();
                    } else {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                resolve();
                            } else {
                                reject('Разрешение на уведомления не предоставлено');
                            }
                        });
                    }
                } else {
                    reject('Уведомления не поддерживаются на этом устройстве');
                }
            });
        };

        const sendPushNotification = (payload) => {
            checkNotificationPermission()
                .then(() => {
                    var nName = payload.account.name + ' ' + payload.account.surname;
                    var nBody = {
                        body: payload.text,
                        icon: '/logo512.png',
                        badge: '/miyuli.purple-50.png',
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        sound: '/notification.mp3',
                        tag: 'message',
                    };
                    if (isMobileDevice) {
                        nBody.data = payload.account.id
                        navigator.serviceWorker?.ready.then((registration) => {
                            registration.showNotification(nName, nBody);
                        });
                    }
                    else {
                        const notification = new Notification(nName, nBody);
                        notification.onclick = () => {
                            window.focus();
                            notification.close();
                            router.push("/im?sel=" + payload.account.id);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                    // Обработка ошибок или показ сообщения пользователю о невозможности отправки уведомления
                });
        };

        if (connection) {
            // Обработка получения сообщения через SignalR
            connection.on('ReceiveMessage', (msgId) => {
                dispatch(newMessage(msgId)).unwrap().then((payload) => {
                    if (isMobileDevice && !document.hasFocus()) {
                        if (payload.account.id == myId) return;
                        // Отправка уведомления на мобильное устройство через Push API
                        sendPushNotification(payload);
                    } else {
                        if (openedChatId === payload.chatId || payload.account.id == myId) return;
                        // Воспроизведение звука внутри сайта для остальных устройств
                        playNotificationSound(payload);
                    }
                });
            })
        }
        return () => {
            if (!connection) return;
            connection.off("ReceiveMessage");
        }
    }, [connection, isMobileDevice, dispatch, openedChatId, audioRef.current, myId]);

    return null; // Компонент не рендерит ничего на UI
};

export default NotificationService;