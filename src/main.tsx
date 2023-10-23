import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import UploadButton from './UploadButton'
import { MNgoSecurePDFViewer } from './lib'
import sample from './sample.pdf'

function blobToBase64(blob: any): any {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

const pdfFile = localStorage.getItem("pdfFile");
const pdfPassword = localStorage.getItem("pdfPassword");

const btnStyle = { fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", height: 23, padding: "0px 10px", borderRadius: 5, cursor: "pointer", border: "0.5px solid #ccc", background: "white", minWidth: "fit-content" };
const btnWrapperStyle = { height: 40, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "100%", overflow: "auto" };

function App() {
    return (
        <>
            <div style={btnWrapperStyle}>
                <UploadButton
                    btnText='Upload PDF'
                    btnStyle={btnStyle}
                    accept="application/pdf"
                    onUpload={async (files) => {
                        const file = files?.[0];
                        if (file) {
                            const base64File = await blobToBase64(file);

                            localStorage.setItem("pdfFile", base64File); // storing image in localStorage
                        }
                    }}
                />

                <input
                    type="text" placeholder='pdf password (if any)'
                    style={{ ...btnStyle, margin: "0px 20px", cursor: "default" }} onChange={(e) => {
                        localStorage.setItem("pdfPassword", e.target.value);
                    }}
                />

                <div role="button"
                    style={btnStyle}
                    onClick={() => location.reload()}
                >
                    Submit
                </div>
            </div>

            <MNgoSecurePDFViewer
                securityOptions={{
                    // blockRightClick: false,
                    // blockUserSelection: false,
                    // blockPrint: false,
                    // blockDownload: false,
                }}
                pdfUrl={pdfFile || sample}
                pdfPassword={pdfPassword || "sample"}
                compHeight={"calc(100vh - 43px)"}
            />
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
