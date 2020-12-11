const { DocumentBackground } = require("docx");

function GENERATEDOCX(){
    let doc = new Document(); 

    doc.createParagraph("Create Paragraph")

    saveDocumentToFile (doc, 'patient.docx')
}
