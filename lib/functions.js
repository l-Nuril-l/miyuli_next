import { MiyuliService } from '@/services/miyuli.service';
import { getCookie } from "cookies-next";
export function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const metadataExtractor = async (z) => {
    var modalName = z?.match(/^[a-z_]+/i);
    if (!modalName) return;
    var data = z?.slice(5)?.split("_");
    switch (modalName[0]) {
        case "photo": {
            const res = await MiyuliService.getImage(data);
            return {
                title: "MIYULI | IMAGE",
                description: res.description,
                openGraph: {
                    title: res.title,
                    type: "website",
                    url: "/image/" + res.id,
                    images: {
                        url: process.env.NEXT_PUBLIC_API + `photo/${res.id}`,
                        secureUrl: process.env.NEXT_PUBLIC_API + `photo/${res.id}`,
                    },
                },
            }
        }
        case "video": {
            const video = await MiyuliService.getVideo(data[1]);
            return {
                title: "MIYULI | " + video.title,
                openGraph: {
                    title: video.title,
                    description: video.description,
                    type: "video.other",
                    url: "/video/" + video.id,
                    videos: {
                        url: process.env.NEXT_PUBLIC_API + `video/stream/${video.id}.mp4`,
                        secureUrl: process.env.NEXT_PUBLIC_API + `video/stream/${video.id}.mp4`,
                        // type: "text/html", //player
                    },
                },
            }
        }
        case "audio_playlist": {
            const res = await MiyuliService.getAudioPlaylist(data[1]);
            return {
                title: "MIYULI | " + res.title,
            }
        }
        default: {
            return {};
        }
    }
}

export const staticMetadataExtractor = (name, data) => {
    switch (name) {
        case "profile": {
            return {
                title: "MIYULI | " + data.name + ' ' + data.surname,
                description: data.status + ' ' + data.bio,
                openGraph: {
                    title: "MIYULI | " + data.name + ' ' + data.surname,
                    description: data.status + ' ' + data.bio,
                    type: "website",
                    images: [{
                        url: process.env.NEXT_PUBLIC_API + "photo/" + data.Avatar?.id + '?' + new URLSearchParams(data.AvatarCrop).toString(),
                        secureUrl: process.env.NEXT_PUBLIC_API + "photo/" + data.Avatar?.id + '?' + new URLSearchParams(data.AvatarCrop).toString(),
                    }, {
                        url: process.env.NEXT_PUBLIC_API + `photo/${data.Avatar?.id}`,
                        secureUrl: process.env.NEXT_PUBLIC_API + `photo/${data.Avatar?.id}`,
                        }]
                },
            }
        }
        case "audio": {
            return {
                title: "MIYULI | " + data.name,
                openGraph: {
                    title: data.name,
                    description: data.artist,
                    type: "music.song",
                    url: "/audio/" + data.id,
                    audio: {
                        url: process.env.NEXT_PUBLIC_API + `audio/stream/${data.id}.mp3`,
                        secureUrl: process.env.NEXT_PUBLIC_API + `audio/stream/${data.id}.mp3`
                    },
                },
            }
        }
        default: {
            return {};
        }
    }
}

export function formatTime(time) {
    if (time === undefined) return null;
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

export function beautifyDate(date, t, locale = getCookie("NEXT_LOCALE") ?? 'en') {
    date = new Date(date)
    return `${date.getDate()} ${date.toLocaleDateString(locale, { month: 'short' })} ${date.getFullYear()} ${t("at")} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function isEmptyOrSpaces(str) {
    return str === null || str.match(/^\s*$/) !== null;
}

export function handleCommonErrorCases(error) {
    if (error === "Network Error" || error === "Rejected") {
        if (navigator.onLine === true) return "Server Error";
    }
    return error;
}

export function rejectActionToError({ payload, meta, error }) {
    if (meta.aborted) return;
    return payload?.responseText ?? payload?.message ?? (payload?.errors && Object.values(payload.errors).join(" ")) ?? payload?.status ?? (typeof payload === 'string' && payload ? payload : error.message)
}

export function axiosErrorToRejectValue(error) {
    const res = error.response?.data ?? error.message
    return res ? res : error.response?.status;
}

export function objectToFormData(obj, rootName, ignoreList) {
    var formData = new FormData();

    function appendFormData(data, root) {
        if (!ignore(root)) {
            root = root || '';
            if (data instanceof File) {
                formData.append(root, data);
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    appendFormData(data[i], root);// + '[' + i + ']'
                }
            } else if (typeof data === 'object' && data) {
                for (var key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        if (root === '') {
                            appendFormData(data[key], key);
                        } else {
                            appendFormData(data[key], root + '.' + key);
                        }
                    }
                }
            } else {
                if (data !== null && typeof data !== 'undefined') {
                    formData.append(root, data);
                }
            }
        }
    }

    function ignore(root) {
        return Array.isArray(ignoreList)
            && ignoreList.some(function (x) { return x === root; });
    }

    appendFormData(obj, rootName);

    return formData;
}

export function formatLastLoginDate(lastLoginDate, t) {
    if (!lastLoginDate) return t('unavailable');
    const currentDate = new Date();
    const timeDifference = currentDate - new Date(lastLoginDate);
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let time;

    if (timeDifference < minute) {
        return t('justNow');
    } else if (timeDifference < hour) {
        const minutes = Math.floor(timeDifference / minute);
        time = t('minute', { count: minutes });
    } else if (timeDifference < day) {
        const hours = Math.floor(timeDifference / hour);
        time = t('hour', { count: hours });
    } else if (timeDifference < week) {
        const days = Math.floor(timeDifference / day);
        time = t('day', { count: days });
    } else if (timeDifference < month) {
        const weeks = Math.floor(timeDifference / week);
        time = t('week', { count: weeks });
    } else if (timeDifference < year) {
        const months = Math.floor(timeDifference / month);
        time = t('month', { count: months });
    } else {
        const years = Math.floor(timeDifference / year);
        time = t('year', { count: years });
    }

    return `${time} ${t('ago')}`;
}