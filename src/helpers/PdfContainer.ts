import * as _ from 'lodash';
import 'pdfjs-dist/webpack';
import { getDocument } from 'pdfjs-dist';
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

export class PdfContainer {
  private pdfDocumentProxy = {} as PDFDocumentProxy;
  private numPages = -Infinity;
  private pdfPageProxies = [] as PDFPageProxy[];
  private pageContainersByScale = new Map<number, PdfPageContainer[]>();

  constructor(private url: string) {}

  async loadPdf() {
    console.log(`Loading PDF from '${this.url}'`);
    const loadingTask: PDFDocumentLoadingTask = getDocument(this.url);
    this.pdfDocumentProxy = await loadingTask.promise;

    this.numPages = this.pdfDocumentProxy.numPages;
    console.log(`Loaded ${this.numPages} pages`);

    this.pdfPageProxies = await Promise.all(
      _.map(_.range(1, this.numPages + 1), async (pageNum) =>
        this.pdfDocumentProxy.getPage(pageNum)
      )
    );
  }

  private static validateScale(scale: number) {
    if (scale <= 0) {
      throw new Error(`Non-positive scale ${scale}`);
    }
  }

  private validatePageNumber(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.numPages) {
      throw new Error(
        `Page number ${pageNumber} out of range [1, ${this.numPages}]`
      );
    }
  }

  async getOnePage(
    pageNumber: number,
    scale: number
  ): Promise<PdfPageContainer> {
    this.validatePageNumber(pageNumber);
    PdfContainer.validateScale(scale);

    let pageContainers = this.pageContainersByScale.get(scale);
    if (!pageContainers) {
      console.log(`Initialize page containers for scale ${scale}`);
      pageContainers = [];
      this.pageContainersByScale.set(scale, pageContainers);
    }

    // Page number is unity-based; arrays are zero-based.
    const pageIndex = pageNumber - 1;

    if (!pageContainers[pageIndex]) {
      console.log(`Draw page ${pageNumber}`);
      pageContainers[pageIndex] = await this.drawOnePage(
        this.pdfPageProxies[pageIndex],
        scale
      );
      this.pageContainersByScale.set(scale, pageContainers);
    }

    console.log(`Return page ${pageNumber} for scale ${scale}`);
    return pageContainers[pageIndex];
  }

  async getAllPages(scale: number): Promise<PdfPageContainer[]> {
    PdfContainer.validateScale(scale);

    let pageContainers = this.pageContainersByScale.get(scale);
    if (!pageContainers) {
      console.log(`Draw all pages`);
      pageContainers = await this.drawAllPages(scale);
      this.pageContainersByScale.set(scale, pageContainers);
    }

    return pageContainers;
  }

  private drawOnePage(
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

  private drawAllPages(scale: number) {
    return Promise.all(
      _.map(this.pdfPageProxies, async (pageProxy) =>
        this.drawOnePage(pageProxy, scale)
      )
    );
  }
}
