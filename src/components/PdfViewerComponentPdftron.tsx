import WebViewer, {Core, UI} from '@pdftron/webviewer';
import pdf1 from '../../public/pfd1.pdf';
import React, {ChangeEvent, useMemo, useState} from 'react';
import {styled} from '@mui/system';
import {Button, Typography} from '@mui/material';

const MyThemeComponent = styled('div')(({theme}) => ({
  color: theme.palette.primary.contrastText,
}));

const PdfViewerComponentPdftron = () => {
  const viewer = React.useRef<any>(null);
  const [instanceUI, setInstanceUI] = useState<typeof UI | undefined>(
    undefined,
  );
  const [instanceCore, setInstanceCore] = useState<typeof Core | undefined>(
    undefined,
  );
  const [annotationId, setAnnotationID] = useState('');
  const a = React.useRef<HTMLDivElement | null>(null).current;

  const toggleElement = (
    {target}: React.ChangeEvent<HTMLInputElement>,
    dataElement: string,
    // instance: typeof UI,
  ) => {
    console.log(instanceUI);
    if (target.checked) {
      instanceUI?.enableElements([dataElement]);
    } else {
      instanceUI?.disableElements([dataElement]);
    }
  };

  const stampEvent = (er: any) => {
    console.log(stampEvent);
  };

  React.useEffect(() => {
    WebViewer(
      {
        path: '/public',
        initialDoc: pdf1,
      },
      viewer.current,
    ).then(instance => {
      setInstanceUI(instance.UI);
      setInstanceCore(instance.Core);
      const {Tools} = instance.Core;
      instance.UI.disableTools([
        Tools.ToolNames.UNDERLINE,
        Tools.ToolNames.UNDERLINE,
        Tools.ToolNames.UNDERLINE3,
        Tools.ToolNames.UNDERLINE2,
        Tools.ToolNames.UNDERLINE4,
        // Tools.ToolNames.SIGNATURE,
      ]);
      // instance.setToolbarGroup(instance.UI.ToolbarGroup.EDIT_TEXT);
      // instance.UI.enableFeatures([instance.Feature.ContentEdit]);
      const {documentViewer, annotationManager, Annotations} = instance.Core;

      annotationManager.addEventListener(
        'annotationChange',
        (annotations, action) => {
          console.log(action);
        },
      );

      annotationManager.addEventListener(
        'annotationSelected',
        (annotations, action) => {
          if (action === 'selected') {
            console.log(annotations);
            console.log('Hello  ');
          }
        },
      );

      const stamp1 = new instance.Core.Tools.StampCreateTool(documentViewer);
      stamp1.addEventListener('annoatationsCreated', e => {
        console.log('ITEMEEE');
      });
      stamp1.on('annotationAdded', e => {
        console.log('ABCDEFG');
      });

      const stamp = new instance.Core.Tools.RubberStampCreateTool(
        documentViewer,
      );
      const free_text = new instance.Core.Tools.FreeTextCreateTool(
        documentViewer,
      );

      stamp.hidePreview();

      // documentViewer.addEventListener('annotationsLoaded', () => {
      //   const annots = annotationManager.getAnnotationsList();
      //   console.log(annots);

      //   // remove annotations
      //   annotationManager.deleteAnnotations(annots);
      // });
      // return annotationManager;
      // document
      //   .getElementById('search')
      //   .onchange((e: GlobalEventHandlers) => console.log(e));

      // a = docuem

      // document.getElementById('search').onchange = e => {
      //   toggleElement(e, 'searchButton');
      // };
    });

    // return () => {
    //   viewer.current = null;
    // };
  }, []);

  return (
    <div
      className="App"
      style={{display: 'flex', justifyContent: 'space-between'}}>
      {/* <h1 id="leftPanel">Hello </h1> */}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{padding: '10px'}}>
          <button
            onClick={() => instanceUI?.toggleElementVisibility('leftPanel')}>
            Panel
          </button>
        </div>
        <div style={{padding: '10px'}}>
          <button
            onClick={() => instanceUI?.toggleElementVisibility('searchPanel')}>
            Search
          </button>
        </div>
        <div style={{padding: '10px'}}>
          <button
            onClick={() =>
              instanceUI?.toggleElementVisibility('signatureModal')
            }>
            Stamp
          </button>
        </div>
        <div style={{padding: '10px'}}>
          <button
            onClick={() =>
              instanceUI?.toggleElementVisibility('rubberStampToolGroupButton')
            }>
            Stamp
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              console.log(
                instanceCore?.documentViewer
                  .getAnnotationManager()
                  .getAnnotationsList()
                  .map((item: any, index) => {
                    if (
                      index ===
                      instanceCore?.documentViewer
                        .getAnnotationManager()
                        .getAnnotationsList().length -
                        1
                    ) {
                      setAnnotationID(item.rs);
                      return item.rs;
                    }
                  }),
              );
              console.log(
                instanceCore?.documentViewer
                  .getAnnotationManager()
                  .getAnnotationsList(),
              );
            }}>
            Get Document
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              console.log(
                instanceCore?.annotationManager.getAnnotationById(annotationId),
              )
            }>
            Get Document
          </button>
        </div>
      </div>
      <div
        className="webviewer"
        style={{width: '80%', height: '100vh'}}
        ref={viewer}></div>
    </div>
  );
};

export default PdfViewerComponentPdftron;
