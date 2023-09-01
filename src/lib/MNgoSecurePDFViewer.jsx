import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import './MNgoSecurePDFViewer.css';

/*
Secure PDF Viewer

✅ block right click
✅ disable user select
✅ block download
✅ block getting pdf url by inspecting elements
✅ block printing of the page/pdf
❌ screenshot
❌ screen recording
✅ open pdf in pdf viewer using the given password programmatically
*/

const MWEB_WIDTH = 650, THUMB_VIEW_WIDTH = 768, TOOL_BAR_HEIGHT = 60;
const TOOL_BAR_BTN_CLASS_NAME = "bn bg-white black br2 pointer f6-5 mh-0-33 pv-0-33 ph-0-67";
const DISABLED_TOOL_BAR_BTN_CLASS_NAME = "o-50 pointer-events-none";


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

function MNgoSecurePDFViewer({
    styles: {
        pdfComponentClassName = "",

        toolbarClassName = "",
        toolbarSegClassName = "",
        toolBarBtnClassName = "",

        pdfViewerClassName = "",
        pdfPageClassName = "",

        pdfThumbContainerClassName = "",
        pdfThumbPageClassName = "",
    },
    pdfUrl,
    pdfPassword,
}) {
    const [totalPagesCount, setTotalPagesCount] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [scale, setScale] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        /*------capture window resize------*/
        const debouncedHandleResize = debounce(() => { setWindowWidth(window.innerWidth) }, 200);

        window.onresize = debouncedHandleResize;
        /*------capture window resize------*/


        /*------capture pdfViewer div scroll------*/
        const debouncedHandleScroll = debounce(handlePdfViewerScroll, 200);

        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.addEventListener("scroll", debouncedHandleScroll);
        /*------capture pdfViewer div scroll------*/


        /*------disable context menu------*/
        function handleContextmenu(e) {
            e.preventDefault();
        }

        document.addEventListener('contextmenu', handleContextmenu)
        /*------disable context menu------*/


        return function cleanup() {
            window.onresize = null;
            pdfViewer.removeEventListener("scroll", debouncedHandleScroll);
            document.removeEventListener('contextmenu', handleContextmenu);
        }
    }, []);

    function handlePdfViewerScroll(event) {
        try {
            const scrollTop = event.target.scrollTop;

            const pagesEle = event.target.querySelectorAll('.react-pdf__Page');
            const pageHeight = pagesEle?.[0]?.getBoundingClientRect()?.height;

            const activeidx = Math.round(scrollTop / pageHeight);
            setActivePage(activeidx + 1);
        } catch (error) {
            console.log("failed to handle scroll", error);
        }
    }

    function onDocumentLoadSuccess({ numPages: totalPagesCount }) {
        setTotalPagesCount(totalPagesCount);
    }

    function handleGoToPage(pageIdx) {
        setActivePage(pageIdx);

        try {
            const pdfViewer = document.getElementById('pdfViewer');
            const selectedPage = pdfViewer.querySelectorAll(`.react-pdf__Page[data-page-number="${pageIdx}"]`);
            selectedPage?.[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                <div className={`no-user-select ${pdfComponentClassName}`}>
                    <div className={`flex items-center justify-between white ba ph-1 ${toolbarClassName}`} style={{ height: TOOL_BAR_HEIGHT }}>
                        <div className={`flex items-center justify-center ${toolbarSegClassName}`}>
                            <button
                                className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName} ${activePage === 1 ? DISABLED_TOOL_BAR_BTN_CLASS_NAME : ""}`}
                                onClick={() => handleGoToPage(activePage - 1)}
                            >{"<"}</button>
                            <button
                                className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName} ${activePage === totalPagesCount ? DISABLED_TOOL_BAR_BTN_CLASS_NAME : ""}`}
                                onClick={() => handleGoToPage(activePage + 1)}
                            >{">"}</button>

                            <div>Page {activePage}<span style={{ opacity: 0.5 }}>/{totalPagesCount}</span></div>
                        </div>

                        <div className={`flex items-center justify-center ${toolbarSegClassName}`}>
                            <button className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName}`} onClick={() => setScale(prev => prev - 0.1)}>{"-"}</button>
                            <div className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName}`}>{Math.floor(scale * 100)}%</div>
                            <button className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName}`} onClick={() => setScale(prev => prev + 0.1)}>{"+"}</button>

                            <button className={`${TOOL_BAR_BTN_CLASS_NAME} ${toolBarBtnClassName}`} onClick={toggleFullScreen}>{"[-]"}</button>
                        </div>
                    </div>

                    <div className="overflow-hidden relative flex items-center justify-center">
                        {
                            (windowWidth > THUMB_VIEW_WIDTH) &&
                            <div
                                className={`relative top-0 left-0 overflow-x-hidden overflow-y-auto ${pdfThumbContainerClassName}`}
                                style={{ maxHeight: `calc(100vh - ${TOOL_BAR_HEIGHT}px)`, minHeight: `calc(100vh - ${TOOL_BAR_HEIGHT}px)` }}
                            >
                                <Document file={pdfUrl} onPassword={(callback) => callback(pdfPassword)} >
                                    {
                                        Array(totalPagesCount).fill(0).map((_, idx) =>
                                            <div
                                                key={idx + 1}
                                                className={`flex flex-column items-center justify-center pointer o-80 mv-1-33 mh-3-33 ${pdfThumbPageClassName} ${activePage === idx + 1 ? 'o-100' : ''}`}
                                                onClick={() => handleGoToPage(idx + 1)}
                                            >
                                                <Page scale={0.2} pageNumber={idx + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                                                <div className="mt-0-33 white f6">{idx + 1}</div>
                                            </div>
                                        )
                                    }
                                </Document>
                            </div>
                        }

                        <div id='pdfViewer'
                            className={`flex justify-center overflow-auto w-100  ${pdfViewerClassName}`}
                            style={{ maxHeight: `calc(100vh - ${TOOL_BAR_HEIGHT}px)`, minHeight: `calc(100vh - ${TOOL_BAR_HEIGHT}px)` }}
                        >
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onPassword={(callback) => callback(pdfPassword)}
                            >
                                {
                                    Array(totalPagesCount).fill(0).map((_, idx) =>
                                        <div key={idx + 1} className={`mv-1-33  ${pdfPageClassName}`}>
                                            <Page
                                                pageNumber={idx + 1}
                                                scale={scale * (windowWidth < MWEB_WIDTH ? 0.5 : 1)}
                                                renderTextLayer={false} renderAnnotationLayer={false}
                                            />
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

export default MNgoSecurePDFViewer;
