require('pdfjs-dist/webpack');

import * as _ from 'lodash';
import { getDocument } from 'pdfjs-dist';
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';

const PIXEL_RATIO = window.devicePixelRatio || 1;

interface PdfPageContainer {
  page: PDFPageProxy;
  canvas: HTMLCanvasElement;
}

export interface PdfContainer {
  url: string;
  pdf: PDFDocumentProxy;
  numPages: number;
  pages: PdfPageContainer[];
}

export async function loadPdf(url: string): Promise<PdfContainer> {
  console.log(`Loading PDF from '${url}'`);
  const loadingTask: PDFDocumentLoadingTask = getDocument(url);
  const pdfDocumentProxy: PDFDocumentProxy = await loadingTask.promise;

  const numPages: number = pdfDocumentProxy.numPages;
  console.log(`Loaded ${numPages} pages`);

  const pages: PdfPageContainer[] = await Promise.all(
    _.map(_.range(1, numPages + 1), async (pageNum) => {
      const pdfPageProxy: PDFPageProxy = await pdfDocumentProxy.getPage(
        pageNum
      );
      const viewport: PageViewport = pdfPageProxy.getViewport({ scale: 1 });
      const canvas: HTMLCanvasElement = await drawPage(pdfPageProxy, viewport);
      setAttributes(canvas, viewport);
      return {
        page: pdfPageProxy,
        canvas: canvas,
      };
    })
  );

  const pdfContainer: PdfContainer = {
    url,
    pdf: pdfDocumentProxy,
    numPages,
    pages,
  };
  console.log('CONTAINER', pdfContainer);
  return pdfContainer;
}

function setAttributes(
  canvas: HTMLCanvasElement,
  viewport: PageViewport,
  scale = 1.0
) {
  canvas.height = Math.floor(viewport.height * PIXEL_RATIO);
  canvas.width = Math.floor(viewport.width * PIXEL_RATIO);

  canvas.style.height = `${Math.floor(viewport.height * scale)}px`;
  canvas.style.width = `${Math.floor(viewport.width * scale)}px`;
}

function drawPage(pageProxy: PDFPageProxy, viewport: PageViewport) {
  console.log('drawPage(%O, %O)', pageProxy, viewport);
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) {
    throw new Error('Canvas has no context');
  }
  canvasContext.scale(PIXEL_RATIO, PIXEL_RATIO);

  const renderTask = pageProxy.render({
    canvasContext,
    viewport,
  });

  return renderTask.promise
    .then(() => {
      console.log(`Rendered page ${pageProxy.pageNumber}`);
      return canvas;
    })
    .catch((error) => {
      throw error;
    });
}
