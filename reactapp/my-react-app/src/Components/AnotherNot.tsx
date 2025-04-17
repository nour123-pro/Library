import { useState, useEffect } from "react";
import { BorrowedBook } from "./interfaces";
import axios from "axios";
import { BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Typography, Tag } from 'antd';

interface Notification {
  bookTitle: string;
  dueDate: Date;
  daysRemaining: number;
  isOverdue: boolean;
  isReturned: boolean;
}

export default function Notificationss({ accountname }: { accountname: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
        processNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setLoading(false);
    }
  };

  const processNotifications = (books: BorrowedBook[]) => {
    const today = new Date();
    const newNotifications: Notification[] = [];

    books.forEach(book => {
      if (!book.dateCreated && book.dueDate) { // Only unreturned books
        const returnDate = new Date(book.dueDate)
        const timeDiff = returnDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        newNotifications.push({
          bookTitle: book.book.bookName || 'Unknown Book',
          dueDate: returnDate,
          daysRemaining,
          isOverdue: daysRemaining < 0,
          isReturned: book.isReturned|| false
        });
      }
    });

    // Sort by urgency: overdue first, then closest due date
    setNotifications(newNotifications.sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
      return a.daysRemaining - b.daysRemaining;
    }));
  };

  useEffect(() => {
    if (accountname) {
      fetchBorrowedBooks();
      const interval = setInterval(fetchBorrowedBooks, 60 * 60 * 1000); // Refresh hourly
      return () => clearInterval(interval);
    }
  }, [accountname]);

  const notificationMenu = (
    <Menu style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <Menu.ItemGroup title="Book Due Notifications">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Menu.Item key={index}>
              <div style={{ padding: '8px 12px' }}>
                <Typography.Text strong>
                  {notification.bookTitle}
                  {notification.isOverdue && (
                    <Tag color="red" style={{ marginLeft: 8 }}>
                      <ExclamationCircleOutlined /> OVERDUE
                    </Tag>
                  )}
                </Typography.Text>
                <div>
                  <Typography.Text type="secondary">
                    Due: {notification.dueDate.toLocaleDateString()}
                  </Typography.Text>
                  <div style={{ 
                    color: notification.isOverdue ? 'red' : 
                           notification.daysRemaining <= 3 ? 'orange' : 'green',
                    marginTop: 4
                  }}>
                    {notification.isOverdue 
                      ? `Overdue by ${Math.abs(notification.daysRemaining)} days!` 
                      : `${notification.daysRemaining} days remaining`}
                  </div>
                </div>
              </div>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item key="no-notifications">
            <Typography.Text>No outstanding book returns</Typography.Text>
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
      overlayStyle={{ width: 350 }}
      disabled={loading}
    >
      <div style={{ padding: '0 16px', cursor: 'pointer' }}>
        <Badge 
          count={notifications.filter(n => !n.isReturned).length} 
          style={{ 
            backgroundColor: notifications.some(n => n.isOverdue) ? '#f5222d' : '#1890ff'
          }}
        >
          <BellOutlined style={{ fontSize: 18 }} />
          {loading && <span style={{ marginLeft: 8 }}>Loading...</span>}
        </Badge>
      </div>
    </Dropdown>
  );
}