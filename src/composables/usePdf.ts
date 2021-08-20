import * as _ from 'lodash';
import { getDocument } from 'pdfjs-dist';
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';

export interface PdfCanvasAttributes {
  height: number;
  width: number;
  style: string;
}

export function usePdf() {
  const PIXEL_RATIO = window.devicePixelRatio || 1;

  const canvasAttrs = (viewport: PageViewport, scale: number) => {
    const canvasHeight = Math.floor(viewport.height * PIXEL_RATIO);
    const canvasWidth = Math.floor(viewport.width * PIXEL_RATIO);

    const canvasStyle: string = [
      `height: ${Math.floor(viewport.height * scale)}px;`,
      `width: ${Math.floor(viewport.width * scale)}px;`,
    ].join(' ');

    return {
      height: canvasHeight,
      width: canvasWidth,
      style: canvasStyle,
    };
  };

  const drawPage = (
    pageProxy: PDFPageProxy,
    canvas: HTMLCanvasElement,
    scale: number
  ) => {
    console.log(pageProxy, canvas, scale);
    const viewport = pageProxy.getViewport({ scale: 1 });
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      throw new Error('Canvas has no context');
    }

    const renderTask = pageProxy.render({
      canvasContext,
      viewport,
    });

    return renderTask.promise
      .then(() => {
        console.log(`Rendered page ${pageProxy.pageNumber}`);
        return canvasAttrs(viewport, scale);
      })
      .catch((error) => {
        throw error;
      });
  };

  const loadPdf = async (url: string) => {
    console.log(`Loading PDF from '${url}'`);
    const loadingTask: PDFDocumentLoadingTask = getDocument(url);
    const pdfDocumentProxy: PDFDocumentProxy = await loadingTask.promise;

    const numPages: number = pdfDocumentProxy.numPages;
    console.log(`Loaded ${numPages} pages`);

    const pdfPageProxies: PDFPageProxy[] = await Promise.all(
      _.map(_.range(1, numPages + 1), (pageNum) =>
        pdfDocumentProxy.getPage(pageNum)
      )
    );
    return { pdfDocumentProxy, pdfPageProxies };
  };

  return {
    loadPdf,
    drawPage,
  };
}
