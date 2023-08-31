import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import './SecurePDFViewer.css';

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

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

function SecurePDFViewer({
    pdfUrl,
    pdfPassword,
}) {
    const [totalPagesCount, setTotalPagesCount] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);

        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.addEventListener("scroll", debouncedHandleScroll);
    }, []);

    function handleScroll(event) {
        const scrollTop = event.target.scrollTop;

        const pagesEle = event.target.querySelectorAll('.react-pdf__Page')
        const thisPageHeight = pagesEle?.[0]?.getBoundingClientRect()?.height;

        console.log("thisPageHeight", thisPageHeight)

        const activeidx = Math.round(scrollTop / thisPageHeight);
        setActivePage(activeidx + 1);
    }

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

    function handleGoToPage(pageIdx) {
        setActivePage(pageIdx);

        try {
            const pdfViewer = document.getElementById('pdfViewer');
            const selectedPage = pdfViewer.querySelectorAll(`.react-pdf__Page[data-page-number="${pageIdx}"]`);
            selectedPage?.[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            console.log("failed to scroll to page", pageIdx, error);
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    return (
        <>
            {
                pdfUrl &&
                <div>
                    <div className='toolbar'>
                        <div className='drctnBar'>
                            <button
                                className={`drctnBtn ${activePage === 1 ? "disabledDrctnBtn" : ""}`}
                                onClick={() => handleGoToPage(activePage - 1)}
                            >{"<"}</button>
                            <button
                                className={`drctnBtn ${activePage === totalPagesCount ? "disabledDrctnBtn" : ""}`}
                                onClick={() => handleGoToPage(activePage + 1)}
                            >{">"}</button>

                            <div>Page {activePage}<span style={{ opacity: 0.5 }}>/{totalPagesCount}</span></div>
                        </div>

                        <div className='zoomBar'>
                            <button className={`drctnBtn`} onClick={() => setScale(prev => prev - 0.1)}>{"-"}</button>
                            <div className={`drctnBtn`}>{Math.floor(scale * 100)}%</div>
                            <button className={`drctnBtn`} onClick={() => setScale(prev => prev + 0.1)}>{"+"}</button>

                            <button className={`drctnBtn`} onClick={toggleFullScreen}>{"[-]"}</button>
                        </div>
                    </div>

                    <div className='pdf'>
                        <div className='pdfThumbContainer'>
                            <Document
                                file={pdfUrl}
                                onPassword={(callback) => callback(pdfPassword)}
                            >
                                {
                                    Array(totalPagesCount).fill(0).map((_, idx) =>
                                        <div
                                            key={idx + 1}
                                            className={`pdfThumbPage ${activePage === idx + 1 ? 'activeThumbPage' : ''}`}
                                            onClick={() => handleGoToPage(idx + 1)}
                                        >
                                            <Page scale={0.2} pageNumber={idx + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                                            <div className='pdfThumbPageCount'>{idx + 1}</div>
                                        </div>
                                    )
                                }
                            </Document>
                        </div>

                        <div className='pdfViewer' id='pdfViewer'>
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onPassword={(callback) => callback(pdfPassword)}
                            >
                                {
                                    Array(totalPagesCount).fill(0).map((_, idx) =>
                                        <div key={idx + 1} className='pdfPage'>
                                            <Page pageNumber={idx + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
                                        </div>
                                    )
                                }
                            </Document>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default SecurePDFViewer;
