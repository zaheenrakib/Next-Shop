"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Undo, Redo, 
  Link as LinkIcon, Unlink 
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TiptapEditor = ({ value, onChange, placeholder }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-b-xl',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
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
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-wrap gap-1 p-2 bg-slate-100 border border-slate-200 border-b-0 rounded-t-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("bold") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("italic") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("underline") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("bulletList") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("orderedList") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-all ${editor.isActive("blockquote") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <Quote size={16} />
        </button>
        <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />
        <button
          type="button"
          onClick={toggleLink}
          className={`p-1.5 rounded transition-all ${editor.isActive("link") ? "bg-slate-300 text-slate-900" : "text-slate-500 hover:bg-slate-200"}`}
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="p-1.5 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30"
        >
          <Unlink size={16} />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded text-slate-500 hover:bg-slate-200"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded text-slate-500 hover:bg-slate-200"
        >
          <Redo size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
