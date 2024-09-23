import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  BoldIcon,
  BulletedListIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from '@/icons/editor';
import { Separator } from '../ui/separator';
import { Level } from '@tiptap/extension-heading';

export default ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const style = {
    active: 'bg-washed-100 dark:bg-slate-700',
    button: cn('h-8 w-8 rounded-lg flex items-center justify-center'),
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  type headingType = '1' | '2' | '3' | '4' | '5' | '6' | 'paragraph';

  const setHeading = (headingLevel: headingType) => {
    if (headingLevel === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(headingLevel) as Level;
      editor.chain().focus().toggleHeading({ level: level }).run();
    }
  };

  const currentLevel: headingType = editor.isActive('heading', { level: 1 })
    ? '1'
    : editor.isActive('heading', { level: 2 })
      ? '2'
      : editor.isActive('heading', { level: 3 })
        ? '3'
        : editor.isActive('heading', { level: 4 })
          ? '4'
          : editor.isActive('heading', { level: 5 })
            ? '5'
            : editor.isActive('heading', { level: 6 })
              ? '6'
              : 'paragraph';

  return (
    <div
      role="toolbar"
      className="flex items-center flex-wrap gap-x-2 px-3 py-2 h-12 sticky top-0 z-10 bg-white justify-between"
    >
      <Select
        onValueChange={(value: any) => setHeading(value)}
        value={currentLevel}
        defaultValue="paragraph"
      >
        <SelectTrigger className="w-[150px] h-8 focus:ring-brand-600/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            showCheckIcon={false}
            className="font-normal text-base"
            value="paragraph"
          >
            Paragraph
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-3xl leading-[38px]"
            value="1"
          >
            Heading 1
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-2xl"
            value="2"
          >
            Heading 2
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-xl leading-[30px]"
            value="3"
          >
            Heading 3
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-lg"
            value="4"
          >
            Heading 4
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-base"
            value="5"
          >
            Heading 5
          </SelectItem>
          <SelectItem
            showCheckIcon={false}
            className="font-semibold text-sm"
            value="6"
          >
            Heading 6
          </SelectItem>
        </SelectContent>
      </Select>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(style.button, editor.isActive('bold') && style.active)}
      >
        <BoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(style.button, editor.isActive('italic') && style.active)}
      >
        <ItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn(
          style.button,
          editor.isActive('underline') && style.active,
        )}
      >
        <UnderlineIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(style.button, editor.isActive('strike') && style.active)}
      >
        <StrikethroughIcon />
      </button>
      <Separator
        orientation="vertical"
        className="h-4.5 w-[1px] bg-outline-300"
      />
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={cn(
          style.button,
          editor.isActive('orderedList') && style.active,
        )}
      >
        <OrderedListIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={cn(
          style.button,
          editor.isActive('bulletList') && style.active,
        )}
      >
        <BulletedListIcon />
      </button>
      <Separator
        orientation="vertical"
        className="h-4.5 w-[1px] bg-outline-300"
      />
      <button
        onClick={setLink}
        className={cn(style.button, editor.isActive('link') && style.active)}
      >
        <LinkIcon />
      </button>
      <div className="flex h-7 items-center justify-center">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={style.button}
        >
          <UndoIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={style.button}
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
};
