import * as _ from 'lodash';
import 'pdfjs-dist/webpack';
import { getDocument } from 'pdfjs-dist';
import { reactive } from 'vue';
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';

const PIXEL_RATIO = window.devicePixelRatio || 1;

export interface PdfPageContainer {
  scale: number;
  viewport: PageViewport;
  canvas: HTMLCanvasElement;
}

export interface PdfContainer {
  pdfDocumentProxy: PDFDocumentProxy;
  numPages: number;
  pdfPageProxies: PDFPageProxy[];
}

export default function usePdf() {
  const pageContainersByScale = new Map<number, PdfPageContainer[]>();

  const pdfContainer = reactive<PdfContainer>({
    pdfDocumentProxy: {} as PDFDocumentProxy,
    numPages: -Infinity,
    pdfPageProxies: [] as Array<PDFPageProxy>,
  });

  async function loadPdf(url: string) {
    console.log(`Loading PDF from '${url}'`);

    // Clear the map in case we're reused.
    pageContainersByScale.clear();

    // Fetch the PDF document.
    const loadingTask: PDFDocumentLoadingTask = getDocument(url);
    pdfContainer.pdfDocumentProxy = await loadingTask.promise;

    // Extract the number of pages.
    pdfContainer.numPages = pdfContainer.pdfDocumentProxy.numPages;
    console.log(`Loaded ${pdfContainer.numPages} pages`);

    // Load all the pages.
    pdfContainer.pdfPageProxies = await Promise.all(
      _.map(_.range(1, pdfContainer.numPages + 1), async (pageNum) =>
        pdfContainer.pdfDocumentProxy.getPage(pageNum)
      )
    );
  }

  function validateScale(scale: number) {
    if (scale <= 0) {
      throw new Error(`Non-positive scale ${scale}`);
    }
  }

  function validatePageNumber(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > pdfContainer.numPages) {
      throw new Error(
        `Page number ${pageNumber} out of range [1, ${pdfContainer.numPages}]`
      );
    }
  }

  async function getOnePage(
    pageNumber: number,
    scale: number
  ): Promise<PdfPageContainer> {
    validatePageNumber(pageNumber);
    validateScale(scale);

    let pageContainers = pageContainersByScale.get(scale);
    if (!pageContainers) {
      console.log(`Initialize page containers for scale ${scale}`);
      pageContainers = [];
      pageContainersByScale.set(scale, pageContainers);
    }

    // Page number is unity-based; arrays are zero-based.
    const pageIndex = pageNumber - 1;

    if (!pageContainers[pageIndex]) {
      console.log(`Draw page ${pageNumber}`);
      pageContainers[pageIndex] = await drawOnePage(
        pdfContainer.pdfPageProxies[pageIndex] as PDFPageProxy,
        scale
      );
      pageContainersByScale.set(scale, pageContainers);
    }

    console.log(`Return page ${pageNumber} for scale ${scale}`);
    return pageContainers[pageIndex];
  }

  async function getAllPages(scale: number): Promise<PdfPageContainer[]> {
    validateScale(scale);

    let pageContainers = pageContainersByScale.get(scale);
    if (!pageContainers) {
      console.log(`Draw all pages`);
      pageContainers = await drawAllPages(scale);
      pageContainersByScale.set(scale, pageContainers);
    }

    return pageContainers;
  }

  function drawOnePage(
    pdfPageProxy: PDFPageProxy,
    scale: number
  ): Promise<PdfPageContainer> {
    const viewport = pdfPageProxy.getViewport({ scale });

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.height = Math.ceil(viewport.height);
    canvas.width = Math.ceil(viewport.width);
    canvas.style.height = `${Math.ceil(canvas.height / PIXEL_RATIO)}px`;
    canvas.style.width = `${Math.ceil(canvas.width / PIXEL_RATIO)}px`;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      throw new Error('Canvas has no context');
    }

    const pageNumber = pdfPageProxy.pageNumber;

    const renderTask = pdfPageProxy.render({
      canvasContext,
      viewport,
    });

    return renderTask.promise
      .then(() => {
        console.log(`Rendered page ${pageNumber}`);
        return {
          scale,
          viewport,
          canvas,
        };
      })
      .catch((error) => {
        console.error(`Failed to render page ${pageNumber}:`, error);
        throw error;
      });
  }

  function drawAllPages(scale: number) {
    return Promise.all(
      _.map(pdfContainer.pdfPageProxies, async (pageProxy) =>
        drawOnePage(pageProxy as PDFPageProxy, scale)
      )
    );
  }

  return {
    loadPdf,
    pdfContainer,
    getOnePage,
    getAllPages,
  };
}
