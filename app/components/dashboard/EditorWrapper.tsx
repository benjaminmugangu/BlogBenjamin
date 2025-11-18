"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Type pour le contenu JSON de l'éditeur
type JSONContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
  }[];
  text?: string;
};

interface EditorProps {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}

export default function EditorWrapper({ initialValue, onChange }: EditorProps) {
  const [content, setContent] = useState<string>(
    initialValue ? JSON.stringify(initialValue) : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    
    // Créer un objet JSON simple pour le contenu
    const jsonContent: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: value,
            },
          ],
        },
      ],
    };
    
    onChange(jsonContent);
  };

  return (
    <div className="min-h-[200px] w-full rounded-md border border-input bg-background">
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Écrivez votre article ici..."
        className="prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full p-4 min-h-[200px] resize-none"
      />
    </div>
  );
}