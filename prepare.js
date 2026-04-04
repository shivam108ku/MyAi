import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export async function indexTheDocument(filePath){
    const loader = new PDFLoader(filePath, {splitPages: false});
    const doc = await loader.load();
    const document = doc[0].pageContent;

    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 70,
  });

  const texts = await textSplitter.splitText(document);
  console.log(texts.length);

}

