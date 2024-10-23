import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => [
    { id: 1, content: 'Awake', done: true },
    { id: 2, content: 'Sleep', done: false }
]
//.addMatcher(isAnyOf (createTodoSuccess, updateTodoSuccess),
const todoSlice = createSlice({
    name: "todo",
    initialState: getInitialState(),
    reducers: {
        add(items, action) {
            console.log(1)
            items.push({
                id: 1 + Math.max(0, ...items.map(i => i.id)),
                content: action.payload,
                done: false,
            })
        },
        remove(items, action) {
            const item = items.find((item) => item.id === action.payload);
            items.splice(items.indexOf(item), 1);
        },
        doneToggle(items, action) {
            const item = items.find((item) => item.id === action.payload);
            if (item) {
                item.done = !item.done;
            }
        }
    }
})

export const { add, remove, doneToggle } = todoSlice.actions;

export default todoSlice.reducer