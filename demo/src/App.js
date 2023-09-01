import React from 'react';
import { MNgoSecurePDFViewer } from "react-secure-pdf-viewer-mngo";
import secured from "./secured.pdf";

function App() {
    return (
        <MNgoSecurePDFViewer
            styles={{
                pdfComponentClassName: "pdfComponent",
                toolbarClassName: "toolbar",
                pdfThumbContainerClassName: "pdfThumbContainer",
            }}
            pdfUrl={secured}
            pdfPassword={"sample"}
        />
    );
}

export default App;
