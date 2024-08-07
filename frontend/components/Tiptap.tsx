'use client'

import { cn } from '@/lib/utils';
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { buttonVariants } from './ui/button'
import { BoldIcon, BulletedListIcon, ItalicIcon, LinkIcon, OrderedListIcon, RedoIcon, StrikethroughIcon, UnderlineIcon, UndoIcon } from '@/icons/editor';
import BulletList from '@tiptap/extension-bullet-list';
import Underline from '@tiptap/extension-underline';
import ListItem from '@tiptap/extension-list-item';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';



const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const style = {
        active: "bg-blue-100 dark:bg-slate-700",
        button: cn(
            buttonVariants({ size: null }),
            "group relative size-7 bg-inherit active:bg-blue-100 dark:active:bg-slate-700",
            "text-zinc-500 active:text-slate-700 dark:active:text-blue-100"
        ),
        icon_active: "text-slate-700 dark:text-blue-100",
        icon_inactive: "text-zinc-500",
        inactive: "hover:bg-bg-hover",
    };

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)


        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])


    return (
        <div role="toolbar" className="flex flex-wrap gap-x-2 px-3 py-2">
            <button
                onClick={() => (editor.chain().focus().toggleBold().run())}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn(
                    style.button,
                    editor.isActive("bold") ? style.active : style.inactive
                )}
            >
                <BoldIcon
                    className={cn(
                        "size-5",
                        editor.isActive("bold") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => (editor.chain().focus().toggleItalic().run())}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                    style.button,
                    editor.isActive("italic") ? style.active : style.inactive
                )}
            >
                <ItalicIcon
                    className={cn(
                        "size-5",
                        editor.isActive("italic") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => (editor.chain().focus().toggleUnderline().run())}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={cn(
                    style.button,
                    editor.isActive("underline") ? style.active : style.inactive
                )}
            >
                <UnderlineIcon
                    className={cn(
                        "size-5",
                        editor.isActive("underline") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => (editor.chain().focus().toggleStrike().run())}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                    style.button,
                    editor.isActive("strike") ? style.active : style.inactive
                )}
            >
                <StrikethroughIcon
                    className={cn(
                        "size-5",
                        editor.isActive("strike") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => (editor.chain().focus().toggleOrderedList().run())}
                disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                className={cn(
                    style.button,
                    editor.isActive("orderedList") ? style.active : style.inactive
                )}
            >
                <OrderedListIcon
                    className={cn(
                        "size-5",
                        editor.isActive("orderedList") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={cn(
                    style.button,
                    editor.isActive("bulletList") ? style.active : style.inactive
                )}
            >
                <BulletedListIcon
                    className={cn(
                        "size-5",
                        editor.isActive("bulletList") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={cn(
                    style.button,
                    editor.isActive("bulletList") ? style.active : style.inactive
                )}
            >
                <BulletedListIcon
                    className={cn(
                        "size-5",
                        editor.isActive("bulletList") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <button
                onClick={setLink}
                className={cn(
                    style.button,
                    editor.isActive("link") ? style.active : style.inactive
                )}
            >
                <LinkIcon
                    className={cn(
                        "size-5",
                        editor.isActive("link") ? style.icon_active : style.icon_inactive
                    )}
                />
            </button>
            <div>
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={style.button}
                >
                    <UndoIcon
                        className={"size-5"}
                    />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={style.button}
                >
                    <RedoIcon
                        className={"size-5"}
                    />
                </button>
            </div>
        </div>
    );
};

export default () => {
    const editor = useEditor({
        extensions: [StarterKit, BulletList, Underline, ListItem, Link.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
        })],
        content: `<ul>
          <li>A list item</li>
          <li>And another one</li>
        </ul>`,
    });



    return (
        <div className="flex flex-col divide-y rounded-lg border border-border">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};


