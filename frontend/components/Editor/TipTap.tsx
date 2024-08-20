'use client';

import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, UseEditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Menubar from './Menubar';

export default ({
  isEditable = true,
  hasMenuBar = true,
  editorText,
  setEditorText,
  className,
}: {
  isEditable?: boolean;
  hasMenuBar?: boolean;
  editorText: any;
  setEditorText?: (content: string) => void;
  className: string;
}) => {
  const editorProps: Partial<UseEditorOptions> = {
    // editor props for both editable and view only editors
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    content: editorText,
    editable: isEditable,
    immediatelyRender: false,
  };

  if (isEditable && setEditorText) {
    editorProps.onUpdate = ({ editor }) => setEditorText(editor.getHTML());
  }

  const editor = useEditor(editorProps);
  return (
    <div className={className}>
      {hasMenuBar && <Menubar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};
