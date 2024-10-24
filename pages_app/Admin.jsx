"use client";
import { clearAudiosAdmin, clearFilesAdmin, clearImagesAdmin, clearVideosAdmin } from "@/lib/features/admin";
import { test401 } from "@/lib/features/auth";
import { switchAPI } from "@/lib/features/miyuli";
import { useAppDispatch } from "@/lib/hooks";
import axios from "axios";
import Link from "next/link";
import "./Admin.scss";

const Admin = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="admin_page">
            <div>
                <h1>HI ADMIN!</h1>
                <div className="mlg_container">
                    <Link href="/admin/posts" className="mlg">
                        <span /><span /><span /><span />
                        Posts</Link>
                    <Link href="/admin/roles" className="mlg">
                        <span /><span /><span /><span />
                        Roles
                    </Link>
                    <Link href="/admin/player" className="mlg">
                        <span /><span /><span /><span />
                        VPLAYER
                    </Link>
                    <div className="mlg" onClick={() => axios.get("https://miyulibackend.pp.ua/api/file/getFiles").then(console.log)}>
                        <span /><span /><span /><span />
                        AXIOS
                    </div>
                    <div className="mlg" onClick={() => {
                        axios.defaults.baseURL = "https://miyulibackend.pp.ua/api/"
                        dispatch(switchAPI("https://miyulibackend.pp.ua/api/"))
                    }}>
                        <span /><span /><span /><span />
                        BACKEND_L2P
                    </div>
                    <div className="mlg" onClick={() => {
                        axios.defaults.baseURL = "https://localhost:7284/api/"
                        dispatch(switchAPI("https://localhost:7284/api/"))
                    }}>
                        <span /><span /><span /><span />
                        BACKEND_P2L
                    </div>
                    <div className="mlg" onClick={() => dispatch(test401())}>
                        <span /><span /><span /><span />
                        Unauthorized
                    </div>
                    <div className="mlg rainbow" onClick={() => { dispatch(clearAudiosAdmin()) }}>
                        <span /><span /><span /><span />
                        AUDIOS
                    </div>
                    <div className="mlg rainbow" onClick={() => { dispatch(clearVideosAdmin()) }}>
                        <span /><span /><span /><span />
                        VIDEOS
                    </div>
                    <div className="mlg rainbow" onClick={() => { dispatch(clearImagesAdmin()) }}>
                        <span /><span /><span /><span />
                        Images
                    </div>
                    <div className="mlg rainbow" onClick={() => { dispatch(clearFilesAdmin()) }}>
                        <span /><span /><span /><span />
                        FILES
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;