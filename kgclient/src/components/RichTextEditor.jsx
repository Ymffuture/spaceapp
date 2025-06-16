import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Optional custom config for cleaner UI
const editorConfig = {
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'underline', 'link', '|',
    'bulletedList', 'numberedList', '|',
    'blockQuote', 'insertTable', '|',
    'undo', 'redo'
  ],
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  removePlugins: ['ImageUpload', 'MediaEmbed'] // Optional: remove heavy features
};

const RichTextEditor = ({ initialData = '', onChangeContent }) => {
  const [data, setData] = useState(initialData);

  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900 p-3 transition-all">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={data}
        onReady={editor => {
          console.log('CKEditor Ready', editor);
        }}
        onChange={(event, editor) => {
          const content = editor.getData();
          setData(content);
          if (onChangeContent) onChangeContent(content);
        }}
        onBlur={(event, editor) => {
          console.log('Editor blur');
        }}
        onFocus={(event, editor) => {
          console.log('Editor focus');
        }}
      />
    </div>
  );
};

export default RichTextEditor;

