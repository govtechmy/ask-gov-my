'use client'

import { useEditor, EditorContent, Editor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { buttonVariants } from './ui/button'
import { BoldIcon, BulletedListIcon, ItalicIcon, LinkIcon, OrderedListIcon, RedoIcon, StrikethroughIcon, UnderlineIcon, UndoIcon } from '@/icons/editor';
import Underline from '@tiptap/extension-underline';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';


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


