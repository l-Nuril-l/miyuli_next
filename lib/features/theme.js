import { createSlice } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';
export const MIYULI_THEMES = { LIGHT: 'light', DARK: 'dark', AMOLED: 'amoled', SYSTEM: 'system' }

export const getThemeInitialState = (theme) => {
    let obj = { theme: theme ?? MIYULI_THEMES.SYSTEM }
    return obj;
}

const themeSlice = createSlice({
    name: "theme",
    initialState: getThemeInitialState(),
    reducers: {
        change(items, { payload }) {
            let newTheme = payload;
            const values = Object.values(MIYULI_THEMES);
            if (newTheme === undefined) {
                const curId = values.indexOf(items.theme);
                newTheme = ((curId + 1 < values.length) ? values[curId + 1] : values[0])
            }
            if (!values.includes(newTheme)) return;
            changeTheme(items.theme, newTheme)
            items.theme = newTheme
            setCookie("theme", items.theme)
        },
    }
})

const changeTheme = (old, theme) => {
    document.querySelector('html').classList.replace(old, theme);
}

export const { change } = themeSlice.actions;

export default themeSlice.reducer