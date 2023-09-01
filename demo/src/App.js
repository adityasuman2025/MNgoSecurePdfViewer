import React from 'react';
import { MNgoSecurePDFViewer } from "react-secure-pdf-viewer-mngo";
import secured from "./secured.pdf";

function App() {
    return (
        <MNgoSecurePDFViewer
            pdfUrl={secured}
            pdfPassword={"sample"}
        />
    );
}

export default App;
