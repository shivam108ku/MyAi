import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

export function indexTheDocument(filePath){
    const loader = new PDFLoader(filePath)
    const docs = loader.load();
    console.log(docs);
}