import SecurePDFViewer from './SecurePDFViewer'
import sample from './sample.pdf'
import secured from './secured.pdf'

const pdfUrl = "http://www.bitsavers.org/pdf/3Com/3+Open/5385-01_3+Open_for_Macintosh_Software_and_Documentation.pdf"; //'https://cors-anywhere.herokuapp.com/https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
// "http://www.bitsavers.org/pdf/3Com/3+Open/5385-01_3+Open_for_Macintosh_Software_and_Documentation.pdf"

function App() {
    return (
        <SecurePDFViewer
            pdfUrl={sample}
            pdfPassword={"sample"}
        />
    )
}

export default App
