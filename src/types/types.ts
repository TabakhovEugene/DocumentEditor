export type BlockType = 'heading' | 'paragraph' | 'image' | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  caption?: string;
}