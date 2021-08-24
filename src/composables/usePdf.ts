import { onMounted, watch, ref, Ref } from 'vue';
import * as _ from 'lodash';
import { getDocument } from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/display/api';

export default function usePdf(url: Ref<string>) {
  const pdfDocumentProxy = ref({} as PDFDocumentProxy);
  const numPages = ref(0);
  const pageProxies = ref([] as PDFPageProxy[]);

  const loadPdf = async () => {
    console.log(`Loading PDF from '${url.value}'`);
    const loadingTask = getDocument(url.value);
    pdfDocumentProxy.value = await loadingTask.promise;

    numPages.value = pdfDocumentProxy.value.numPages;
    console.log('PAGES', numPages.value);

    pageProxies.value = await Promise.all(
      _.map(_.range(1, numPages.value + 1), (pageNum) =>
        pdfDocumentProxy.value.getPage(pageNum)
      )
    );
    console.log('PDF Loaded');
  };

  onMounted(loadPdf);
  watch(url, loadPdf);

  return {
    pdfDocumentProxy,
    numPages,
    pageProxies,
  };
}
