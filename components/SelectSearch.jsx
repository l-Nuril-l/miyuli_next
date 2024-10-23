"use client";
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { countries } from '../enums/countries';
import useClickOutside from '../hooks/useClickOutside';
import "./SelectSearch.scss";




export default function SelectSearch({ onSelect, onBlur }) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => { setOpen(false) });
    useEffect(() => {
        if (search === "") onSelect?.("");
    })
    return (
        <div ref={ref} className='select_search dropdown show'>
            <input onBlur={onBlur} className='input form-control' onFocus={() => setOpen(true)} value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul className={classNames('miyuli_dropdown', open ? "show" : "")} >
                {countries.filter(x => x.value.toLowerCase().includes(search.toLowerCase())).map(x =>
                    <li onClick={() => { setSearch(x.value); onSelect?.(x.value); setOpen(false) }} className='miyuli_dropdown_row' key={x.code}>
                        <span>{x.value}</span>
                    </li>)}
            </ul>
        </div >
    )
}
