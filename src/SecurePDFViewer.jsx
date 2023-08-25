import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import './SecurePDFViewer.css'

/*
//ref: https://www.npmjs.com/package/react-pdf
secure pdf viewer

✅ block right click
✅ disable user select
✅ block download
✅ block getting pdf url by inspecting elements
✅ block printing of the page/pdf
❌ screenshot
❌ screen recording
✅ open pdf in pdf viewer using the given password programmatically
*/

function SecurePDFViewer({
    pdfUrl,
    pdfPassword,
}) {
    const [totalPagesCount, setTotalPagesCount] = useState(null);

    useEffect(() => {
        /*------disable context menu------*/
        function handleContextmenu(e) {
            e.preventDefault();
        }

        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
        /*------disable context menu------*/
    }, []);

    function onDocumentLoadSuccess({ numPages: totalPagesCount }) {
        setTotalPagesCount(totalPagesCount);
    }

    return (
        <div id='pdf'>
            {
                pdfUrl &&
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onPassword={(callback) => {
                        callback(pdfPassword)
                    }}
                >
                    {
                        Array(totalPagesCount).fill(0).map((_, idx) =>
                            <Page key={idx + 1} pageNumber={idx + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                        )
                    }
                </Document>
            }
        </div>
    )
}

export default SecurePDFViewer;
