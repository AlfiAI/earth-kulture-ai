
import { format } from 'date-fns';

/**
 * Formats a timestamp into a human-readable relative time
 */
export const formatRelativeTime = (date: Date) => {
  return format(date, 'PPp');
};

/**
 * Formats content as a document with sections for AI messages
 */
export const formatDocumentContent = (content: string) => {
  // Split content by headers (denoted by # or ## style markdown)
  const sections = content.split(/(?=#{1,3}\s)/);
  
  if (sections.length <= 1) {
    // If no headers found, just return the content with proper paragraph formatting
    return content.split('\n').map((line, idx) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      
      if (isBullet) {
        return {
          type: 'bullet' as const,
          content: line.replace(/^[*-]\s/, ''),
          key: idx,
        };
      }
      
      return {
        type: 'paragraph' as const,
        content: line,
        key: idx,
      };
    });
  }
  
  // Process content with sections
  return sections.map((section, idx) => {
    const isHeader = /^#{1,3}\s/.test(section);
    const headerMatch = section.match(/^(#{1,3})\s(.*?)(?:\n|$)/);
    
    if (headerMatch) {
      const headerLevel = headerMatch[1].length;
      const headerText = headerMatch[2];
      const sectionContent = section.replace(/^#{1,3}\s.*?(?:\n|$)/, '').trim();
      
      const lines = sectionContent.split('\n').map((line, lineIdx) => {
        // Handle bold text (**text**)
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        
        if (isBullet) {
          return {
            type: 'bullet' as const,
            content: line.replace(/^[*-]\s/, ''),
            key: `${idx}-${lineIdx}`,
            isHTML: true,
          };
        }
        
        if (line.trim() === '---') {
          return {
            type: 'divider' as const,
            key: `${idx}-${lineIdx}`,
          };
        }
        
        return {
          type: 'paragraph' as const,
          content: line,
          key: `${idx}-${lineIdx}`,
          isHTML: true,
        };
      });
      
      return {
        type: 'section' as const,
        headerLevel,
        headerText,
        lines,
        key: idx,
      };
    }
    
    return {
      type: 'plaintext' as const,
      content: section,
      key: idx,
    };
  });
};
