import Link from "next/link";
import "./Unknown.scss";

export default function Unknown() {
    return (
        <main className={`unknown_page`} style={{ padding: "1rem" }}>
            <p>There&apos;s nothing here!</p>
            <div className="btn_back">
                <Link href="/" className="btn_miyuli">Back</Link>
            </div>
            <img className="trouble_image" alt="EmptyPageImg" src="/images/TIM.png"></img>
        </main>
    )
}