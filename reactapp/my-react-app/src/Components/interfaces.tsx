export interface Author {
  authorId: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  isDeleted: boolean;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Book {
  bookId: string;
  bookName: string;
  authorId: string;
  author: Author | null;
  categoryId: string;
  category: Category | null;
  bookImages: string[] | null; 
  bookDescription: string;
  dateCreated: string;
  isDeleted:boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  dateCreated: string;
  isDeleted: boolean;
  image:File
}

export interface Account {
  accountId: string;
  userId: string;
  user: User | null;
  accountName: string;
  dateCreated: string;
  isDeleted: boolean;
  accountProfileImage: Uint8Array | null;
  accountProfileImageUrl:string
}

export interface BorrowedBook {
  borrowedBookId: string;
  bookId: string;
  book: Book;
  accountId: string;
  account: Account;
  isDeleted: boolean;
  isReturned: boolean;
  dueDate: string;
  dateCreated: string;
}


export interface Comment {
  commentId: string;
  borrowedBookId: string;
  borrowedBook: BorrowedBook;
  commentContent: string;
  createdAt: string;
  isDeleted: boolean;
}
export interface ChatAccount {
  chatAccountId: string;
  chatRoomId: string;
  chatRoom?: ChatRoom;
  accountId: string;
  account?: Account;
  dateCreated: string;
  isDeleted: boolean;
}

export interface ChatRoom {
  chatRoomId: string;
  chatRoomName: string;
  chatRoomImage: Uint8Array; // for binary data
  chatRoomDescription: string;
  createdAt: string; 
  isDeleted: boolean;
  bookId:string;
  book:Book
}
export interface ChatMessage {
  chatMessageId: string;
  chatAccountId: string;
  chatAccount: ChatAccount; 
  content: string;
  createdAt: string;
  isDeleted: boolean;
  file: Uint8Array;
}
export interface Notification {
  notificationId: string;
  notificationName: string;
  dateCreated: string;
  notificationImage?: Uint8Array;
  notificationText?: string;
}
export interface  BookCommentCountDto
{
     bookId:string
     commentsCount:string
}

