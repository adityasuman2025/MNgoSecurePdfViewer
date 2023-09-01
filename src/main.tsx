import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { MNgoSecurePDFViewer } from './lib'
import secured from './secured.pdf'

function blobToBase64(blob: any): any {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

const pdfFile = localStorage.getItem("pdfFile");
const pdfPassword = localStorage.getItem("pdfPassword");

function App() {
    return (
        <>
            <div style={{ background: "#f1f1f1", height: 65, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <label>Upload PDF
                    <input type="file" name="uploadImage"
                        accept="application/pdf"
                        onChange={async (e) => {
                            const file = e?.target?.files?.[0];
                            if (file) {
                                const base64File = await blobToBase64(file);

                                localStorage.setItem("pdfFile", base64File); // storing image in localStorage
                            }
                        }}
                    />
                </label>

                <input type="text" placeholder='pdf password (if any)' style={{ height: 30, padding: 5, width: 180, margin: "0 10px", borderRadius: 5, border: "1px solid lightgrey" }} onChange={(e) => {
                    localStorage.setItem("pdfPassword", e.target.value);
                }} />

                <button type="submit"
                    style={{ height: 40, width: 100, borderRadius: 5, border: "1px solid lightgrey", background: "white" }}
                    onClick={() => {
                        location.reload();
                    }} >
                    submit
                </button>
            </div>

            <MNgoSecurePDFViewer
                pdfUrl={pdfFile || secured}
                pdfPassword={pdfPassword || "sample"}
                compHeight={"calc(100vh - 69px)"}
            />
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
