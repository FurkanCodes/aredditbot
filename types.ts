import { RedditUser } from 'snoowrap';

export interface Comment {
  body: string;
  linkAuthor: string;
  authorFlair: string | null;
  commentAuthor: RedditUser;
}

export type GetComments = () => Promise<Comment[]>;
