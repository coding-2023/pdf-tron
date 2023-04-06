import React from 'react';
import pd, {Instance} from 'pspdfkit';
import '../global.css';

const PdfViewerComponent = (props: {document: string}) => {
  const containerRef = React.useRef<any>(null);
  const [pdInstance, stInstance] = React.useState<Instance>();
  const [attId, setAttId] = React.useState<string>('');

  React.useEffect(() => {
    const container = containerRef.current;
    let instance;

    (async function () {
      pd.unload(container);
      console.log(pd.defaultToolbarItems[1]);

      instance = await pd
        .load({
          // Container where PSPDFKit should be mounted.
          container,
          // The document to open.
          document: props.document,
          // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
          toolbarItems: [
            ...pd.defaultToolbarItems,
            {
              type: 'form-creator',
              dropdownGroup: 'signature-group',
            },
            {
              type: 'content-editor',
              dropdownGroup: 'signature-group',
            },
          ],
          styleSheets: ['./custom-style.css'],
          locale: 'en',
        })
        .then(inst => {
          console.log(inst);
          stInstance(inst);
          return inst;
        });

      instance.setToolbarItems(items =>
        items.map(item => {
          if (item.type === 'signature') {
            item.dropdownGroup = 'signature-group';
          }
          return item;
        }),
      );
      const nodea = instance.contentDocument.createElement('button');
      instance.setDocumentEditorFooterItems(items => {
        items.push({type: 'custom', className: 'cancelButton', node: nodea});
        return items;
      });
      instance.addEventListener('annotations.create', (event: any) => {
        console.log(event._tail.array[0].imageAttachmentId);
        setAttId(event._tail.array[0].imageAttachmentId);
      });
    })();

    return () => {
      pd.unload(container);
    };
  }, []);
  function blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  return (
    <div>
      <button
        onClick={async () => {
          const a = await pdInstance?.exportInstantJSON();
          console.log(a);
          const file = await pdInstance?.getAttachment(attId);
          if (file) {
            const base64 = await blobToBase64(file);
          }
          // file && window.open(URL.createObjectURL(file));
        }}>
        Get
      </button>
      <div
        ref={containerRef}
        style={{width: '100%', height: '100vh', backgroundColor: '#121232'}}
      />
    </div>
  );
};

export default PdfViewerComponent;
