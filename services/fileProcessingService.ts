import * as pdfjsLib from 'pdfjs-dist';


// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ProcessedFile {
  type: 'pdf' | 'ppt' | 'image';
  content: string;
  fileName: string;
  requiresVision?: boolean;
}

export const processPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += `\n--- Page ${i} ---\n${pageText}\n`;
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file');
  }
};

export const processPPTAsImage = async (file: File): Promise<string> => {
  // Convert PPT file to base64 for vision analysis
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read PowerPoint file'));
    };
    reader.readAsDataURL(file);
  });
};

export const processFile = async (file: File): Promise<ProcessedFile> => {
  const fileName = file.name;
  const fileType = file.type;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  if (fileType === 'application/pdf' || fileExtension === 'pdf') {
    const content = await processPDF(file);
    return { type: 'pdf', content, fileName };
  } else if (
    fileType === 'application/vnd.ms-powerpoint' ||
    fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    fileExtension === 'ppt' ||
    fileExtension === 'pptx'
  ) {
    // For PPT files, we'll send them as images to vision AI
    const content = await processPPTAsImage(file);
    return { 
      type: 'ppt', 
      content, 
      fileName,
      requiresVision: true 
    };
  } else if (fileType.startsWith('image/')) {
    // For images, return base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          type: 'image',
          content: e.target?.result as string,
          fileName,
          requiresVision: true
        });
      };
      reader.readAsDataURL(file);
    });
  } else {
    throw new Error('Unsupported file type. Please upload PDF, PPT/PPTX, or image files.');
  }
};
