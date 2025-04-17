import { useState, useEffect } from "react";
import { BorrowedBook } from "./interfaces";
import axios from "axios";
import { BellOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Typography } from 'antd';

interface Notification {
  bookTitle: string;
  dueDate: Date;
  daysRemaining: number;
  isOverdue: boolean;
}

export default function Notifications({ accountname }: { accountname: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/BorrowedBooks/BorrowedBooksForAccount?accountname=${accountname}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data) {
        setBorrowedBooks(response.data);
        processNotifications(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response?.data;
        if (serverResponse?.errors) {
          console.error(serverResponse.errors.join('\n'));
        } else if (serverResponse?.message) {
          console.error(serverResponse.message);
        } else {
          console.error(error.response?.statusText || 'Failed to fetch borrowed books');
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const processNotifications = (books: BorrowedBook[]) => {
    const today = new Date();
    const newNotifications: Notification[] = [];

    books.forEach(book => {
      if (book.dateCreated) {
        const returnDate = new Date(book.dueDate);
        const timeDiff = returnDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysRemaining >= 0) { // Show notifications for books due in 3 days or less
          newNotifications.push({
            bookTitle: book.book.bookName || 'Unknown Book',
            dueDate: returnDate,
            daysRemaining,
            isOverdue: daysRemaining < 0
          });
        }
      }
    });

    setNotifications(newNotifications);
  };

  useEffect(() => {
    if (accountname) {
      fetchBorrowedBooks();
      // Refresh every hour
      const interval = setInterval(fetchBorrowedBooks, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [accountname]);

  const notificationMenu = (
    <Menu>
      <Menu.ItemGroup title="Book Due Notifications">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Menu.Item key={index}>
              <div style={{ padding: '8px 12px' }}>
                <Typography.Text strong>{notification.bookTitle}</Typography.Text>
                <div style={{ color: notification.isOverdue ? 'red' : 'orange' }}>
                  {notification.isOverdue 
                    ? `Overdue! Please return immediately` 
                    : `Due in ${notification.daysRemaining} day(s)`}
                </div>
                <Typography.Text type="secondary">
                  Due: {notification.dueDate.toLocaleDateString()}
                </Typography.Text>
              </div>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item key="no-notifications">
            <Typography.Text>No upcoming due books</Typography.Text>
          </Menu.Item>
        )}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={notificationMenu} 
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ width: 300 }}
    >
      <div style={{ padding: '0 16px', cursor: 'pointer' }}>
        <Badge 
          count={notifications.length} 
          style={{ 
            backgroundColor: notifications.some(n => n.isOverdue) ? '#f5222d' : '#1890ff'
          }}
        >
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>
      </div>
    </Dropdown>
  );
}