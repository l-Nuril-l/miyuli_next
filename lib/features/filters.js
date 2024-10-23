import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
    return ({
        categories: [
            { id: 1, name: "None selected" },
            { id: 2, name: "Art" },
            { id: 3, name: "IT" },
            { id: 4, name: "Games" },
            { id: 5, name: "Music" },
            { id: 6, name: "Photos" },
            { id: 7, name: "Science" },
            { id: 8, name: "Sport" },
            { id: 9, name: "Travel" },
            { id: 10, name: "Movies" },
            { id: 11, name: "Humor" },
            { id: 12, name: "Style" }
        ],
        genres: [
            { id: 1, name: "Other" },
            { id: 2, name: "Rock" },
            { id: 3, name: "Pop" },
            { id: 4, name: "Rap & Hip-Hop" },
            { id: 5, name: "Easy Listening" },
            { id: 6, name: "Dance & House" },
            { id: 7, name: "Instrumental" },
            { id: 8, name: "Metal" },
            { id: 9, name: "Alternative" },
            { id: 10, name: "Dubster" },
            { id: 11, name: "Jazz & Blues" },
            { id: 12, name: "Drum & Bass" },
            { id: 13, name: "Trance" },
            { id: 14, name: "Chanson" },
            { id: 15, name: "Ethnic" },
            { id: 16, name: "Acoustic & Vocal" },
            { id: 17, name: "Reggae" },
            { id: 18, name: "Classical" },
            { id: 19, name: "Indie Pop" },
            { id: 20, name: "Speech" },
            { id: 21, name: "Electropop & Disco" },
        ]
    })

}


const filtersSlice = createSlice({
    name: "filters",
    initialState: getInitialState(),
    reducers: {

    }
})

//export const { } = filtersSlice.actions;

export default filtersSlice.reducer