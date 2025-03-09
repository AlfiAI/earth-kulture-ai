
import { cn } from "@/lib/utils";
import { formatDocumentContent } from '../utils/messageFormatters';

interface FormattedContentProps {
  content: string;
  sender: 'user' | 'ai';
}

const FormattedContent = ({ content, sender }: FormattedContentProps) => {
  if (sender !== 'ai') {
    return (
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  const formattedContent = formatDocumentContent(content);

  if (!Array.isArray(formattedContent)) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const renderContentItem = (item: any) => {
    if (item.type === 'paragraph') {
      if (item.isHTML) {
        return (
          <p 
            key={item.key} 
            className={item.content.trim() ? "mb-2.5" : "mb-1"}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        );
      }
      return (
        <p key={item.key} className={item.content.trim() ? "mb-2.5" : "mb-1"}>
          {item.content}
        </p>
      );
    }

    if (item.type === 'bullet') {
      if (item.isHTML) {
        return (
          <div key={item.key} className="flex items-start gap-2 my-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <p dangerouslySetInnerHTML={{ __html: item.content }} />
          </div>
        );
      }
      return (
        <div key={item.key} className="flex items-start gap-2 my-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
          <p>{item.content}</p>
        </div>
      );
    }

    if (item.type === 'divider') {
      return <hr key={item.key} className="my-4 border-gray-200 dark:border-gray-700" />;
    }

    if (item.type === 'section') {
      return (
        <div key={item.key} className="document-section mb-6">
          {item.headerLevel === 1 && (
            <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
              <h1 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                {item.headerText}
              </h1>
            </div>
          )}
          {item.headerLevel === 2 && (
            <h2 className="text-md font-semibold text-primary/90 border-b border-primary/20 pb-2 mb-3">
              {item.headerText}
            </h2>
          )}
          {item.headerLevel === 3 && (
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {item.headerText}
            </h3>
          )}
          
          <div className="mt-3 text-sm leading-relaxed">
            {item.lines.map(renderContentItem)}
          </div>
        </div>
      );
    }

    if (item.type === 'plaintext') {
      return (
        <div key={item.key} className="leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn(
      sender === 'ai' 
        ? "prose prose-sm dark:prose-invert max-w-none"
        : "whitespace-pre-wrap"
    )}>
      <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
        {formattedContent.map(renderContentItem)}
      </div>
    </div>
  );
};

export default FormattedContent;
