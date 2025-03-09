
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
  // Clean up markdown artifacts before processing
  let cleanedContent = content
    .replace(/---/g, '<hr>') // Replace markdown dividers with HTML ones
    .replace(/^#\s*#\s*/gm, '') // Remove ## at beginning of lines
    .replace(/^\*\*(.*?)\*\*$/gm, '<strong>$1</strong>') // Handle bold items
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Handle bold text
  
  // Split content by headers (denoted by # style markdown)
  const sections = cleanedContent.split(/(?=^#\s)/m);
  
  if (sections.length <= 1) {
    // If no headers found, just return the content with proper paragraph formatting
    return cleanedContent.split('\n').map((line, idx) => {
      if (line.includes('<hr>')) {
        return {
          type: 'divider' as const,
          key: idx,
        };
      }
      
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      
      if (isBullet) {
        return {
          type: 'bullet' as const,
          content: line.replace(/^[*-]\s/, ''),
          key: idx,
          isHTML: line.includes('<strong>'),
        };
      }
      
      return {
        type: 'paragraph' as const,
        content: line,
        key: idx,
        isHTML: line.includes('<strong>'),
      };
    });
  }
  
  // Process content with sections
  return sections.map((section, idx) => {
    const headerMatch = section.match(/^#\s+(.*?)(?:\n|$)/);
    
    if (headerMatch) {
      const headerText = headerMatch[1].trim();
      const sectionContent = section.replace(/^#\s+.*?(?:\n|$)/, '').trim();
      
      const lines = sectionContent.split('\n').map((line, lineIdx) => {
        if (line.includes('<hr>')) {
          return {
            type: 'divider' as const,
            key: `${idx}-${lineIdx}`,
          };
        }
        
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        
        if (isBullet) {
          return {
            type: 'bullet' as const,
            content: line.replace(/^[*-]\s/, ''),
            key: `${idx}-${lineIdx}`,
            isHTML: line.includes('<strong>'),
          };
        }
        
        return {
          type: 'paragraph' as const,
          content: line,
          key: `${idx}-${lineIdx}`,
          isHTML: line.includes('<strong>'),
        };
      });
      
      return {
        type: 'section' as const,
        headerLevel: 1,
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
