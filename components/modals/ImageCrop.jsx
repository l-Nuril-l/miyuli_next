
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import "react-image-crop/src/ReactCrop.scss";

const ImageCrop = ({ children, onCrop, onBack, initialCrop }) => {

    const t = useTranslations()
    const imgCrop = useRef(null)
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        height: 100
    });

    const initCrop = () => {
        if (!initialCrop) return;
        const { naturalWidth, width } = imgCrop.current;
        const scale = (Math.floor(width * 100 / naturalWidth * 100) / 10000);
        setCrop({
            unit: 'px',
            x: Math.floor(initialCrop.x * scale),
            y: Math.floor(initialCrop.y * scale),
            width: Math.round(initialCrop.width * scale),
            height: Math.round(initialCrop.height * scale)
        })
    }

    const onAction = () => {
        const { naturalWidth, naturalHeight, width } = imgCrop.current;
        if (crop.unit === "%") {
            onCrop({
                x: 0,
                y: 0,
                width: naturalWidth,
                height: naturalHeight,
            })
            return
        }

        const scale = naturalWidth / width

        const originCrop = {
            x: Math.round(crop.x * scale),
            y: Math.round(crop.y * scale),
            width: Math.floor(crop.width * scale),
            height: Math.floor(crop.height * scale)
        }
        onCrop(originCrop)
    }

    // useEffect(() => {
    //     const resizeHandler = (e) => {}
    //     window.addEventListener("resize", resizeHandler)
    //     return () => {
    //         window.removeEventListener("resize", resizeHandler)
    //     };
    // }, []);

    return (
        <div className="align-self-center">
            <ReactCrop
                minWidth={100 / (imgCrop.current?.naturalHeight / imgCrop.current?.height)}
                minHeight={100 / (imgCrop.current?.naturalWidth / imgCrop.current?.width)}
                crop={crop}
                onChange={(c) => setCrop(c)}
            >
                {React.cloneElement(children, {
                    ref: imgCrop,
                    onLoad: initCrop
                })}
            </ReactCrop>
            <div className="buttons_center">
                <button
                    className="btn_miyuli"
                    onClick={onAction}>
                    {t("save")}
                </button>
                <button
                    className="btn_miyuli"
                    onClick={onBack}>
                    {t("back")}
                </button>
            </div>
        </div>
    );
}

export default ImageCrop;
