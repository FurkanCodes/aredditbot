require('dotenv').config();
const Snoowrap = require('snoowrap');
import { Comment as SnooWrapComment } from 'snoowrap';
import { Comment, GetComments } from 'types';

interface RawComment extends SnooWrapComment {
  link_author: string;
}

const r = new Snoowrap({
  userAgent: 'Whatever',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

const SUBREDDIT_NAME = 'tgtestbot';

const getMappedComments = (comments: RawComment[]) =>
  comments.map(
    ({
      body,
      link_author: linkAuthor,
      author_flair_text: authorFlair,
      author: commentAuthor,
    }) => ({
      body,
      linkAuthor,
      authorFlair,
      commentAuthor,
    })
  );

const getComments: GetComments = () =>
  r
    .getSubreddit(SUBREDDIT_NAME)
    .getNewComments()
    .then((comments: RawComment[]): Comment[] => {
      return getMappedComments(comments);
    });

const Increase = (comments: Comment[]) => {
  comments.forEach((comment: Comment): void => {
    if (comment.body.indexOf('Δ') !== -1) {
      increase(comment.linkAuthor);
    }
  });
};

const increase = async (linkAuthor: string) => {
  let flair = await r.getSubreddit(SUBREDDIT_NAME).getUserFlair(linkAuthor)
    .flair_text;

  if (!flair) {
    r.getUser(linkAuthor).assignFlair({
      subredditName: SUBREDDIT_NAME,
      text: 'Delta 1',
    });
  } else {
    const splitFlair = flair.split(' ');
    const intFlair = parseInt(splitFlair[1]);
    const pointValue = intFlair + 1;
    r.getUser(linkAuthor).assignFlair({
      subredditName: SUBREDDIT_NAME,
      text: 'Delta ' + pointValue,
    });
  }
};

const main = async (): Promise<void> => {
  const comments = await getComments();
  Increase(comments);
};
main();
