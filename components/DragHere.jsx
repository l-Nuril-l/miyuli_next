"use client";
import { useAppSelector } from '@/lib/hooks';
import classNames from "classnames";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import './DragHere.scss';




const DragHere = ({ onDrop }) => {
    const isGlobalDragging = useAppSelector(s => s.miyuli.isDragging);
    const [isDragging, setIsDragging] = useState(false);
    const t = useTranslations()
    return <>
        {
            isGlobalDragging && <div className='drag_here_zone' onDragOver={e => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setIsDragging(false); onDrop(e) }} onDragEnter={() => setIsDragging(true)} onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && setIsDragging(false)}>
                <div className={classNames('drag_in', isDragging && 'active')}>
                    {t(isDragging ? "releaseLMBToAttach" : "dragHereToAttach")}
                </div>
            </div>
        }
    </>
};

export default DragHere;
