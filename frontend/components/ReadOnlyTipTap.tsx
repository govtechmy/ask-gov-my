'use client'

import { useEditor, EditorContent, Editor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

export default ({
    editorText,
  }: {
    editorText: any;
  }) => {
    const editor = useEditor({
        extensions: [StarterKit, Underline, Link.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
        })],
        content: editorText,
        editable: false,
        immediatelyRender: false
    });



    return (
            <EditorContent editor={editor}  className="w-full flex-1"/>
    );
};


